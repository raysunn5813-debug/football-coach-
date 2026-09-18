"""
backend/engine/utils.py
Universal object/dict attribute adapter and geometry helper.
"""
import math

def get_prop(obj, key, default=None):
    if obj is None:
        return default
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)

def set_prop(obj, key, value):
    if obj is None:
        return
    if isinstance(obj, dict):
        obj[key] = value
    else:
        try:
            setattr(obj, key, value)
        except (AttributeError, ValueError):
            # Fallback for frozen models/slots, bypassing standard setters
            object.__setattr__(obj, key, value)

def get_pos(obj):
    """Normalized tuple: (x = length, y = height, z = lateral width)"""
    if obj is None:
        return 0.0, 0.0, 0.0

    if isinstance(obj, dict):
        pos = obj.get("position", obj)
        # Handle case where the dict contains a nested dictionary
        if isinstance(pos, dict):
            return float(pos.get("x", 0.0)), float(pos.get("y", 0.0)), float(pos.get("z", 0.0))
        # Handle hybrid case where the dict contains a nested object
        return float(getattr(pos, "x", 0.0)), float(getattr(pos, "y", 0.0)), float(getattr(pos, "z", 0.0))
    
    pos = getattr(obj, "position", obj)
    x = getattr(pos, "x", getattr(obj, "x", 0.0))
    y = getattr(pos, "y", getattr(obj, "y", 0.0))
    z = getattr(pos, "z", getattr(obj, "z", 0.0))
    return float(x), float(y), float(z)

def set_pos(obj, x=None, y=None, z=None):
    if obj is None:
        return

    if isinstance(obj, dict):
        target = obj["position"] if "position" in obj else obj
        # If the target is an embedded object rather than a dict, handle it dynamically
        if not isinstance(target, dict):
            if x is not None: set_prop(target, "x", float(x))
            if y is not None: set_prop(target, "y", float(y))
            if z is not None: set_prop(target, "z", float(z))
            return
            
        if x is not None: target["x"] = float(x)
        if y is not None: target["y"] = float(y)
        if z is not None: target["z"] = float(z)
    else:
        target = getattr(obj, "position", obj)
        if x is not None: set_prop(target, "x", float(x))
        if y is not None: set_prop(target, "y", float(y))
        if z is not None: set_prop(target, "z", float(z))

def point_to_segment_distance(px, pz, x1, z1, x2, z2):
    """Calculates perpendicular distance from point (px, pz) to segment (x1, z1)->(x2, z2)."""
    dx = x2 - x1
    dz = z2 - z1
    if dx == 0 and dz == 0:
        return math.hypot(px - x1, pz - z1)
    
    t = max(0.0, min(1.0, ((px - x1) * dx + (pz - z1) * dz) / (dx * dx + dz * dz)))
    proj_x = x1 + t * dx
    proj_z = z1 + t * dz
    return math.hypot(px - proj_x, pz - proj_z)