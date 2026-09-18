from pathlib import Path
from sqlmodel import SQLModel, create_engine, Session

current_file = Path(__file__).resolve()
project_root = current_file.parent.parent if current_file.parent.name == "backend" else current_file.parent
db_path = project_root / "franchise.db"

DATABASE_URL = f"sqlite:///{db_path}"

# create_engine handles the connection pool for SQLite
engine = create_engine(DATABASE_URL, echo=False)

def init_db():
    # Automatically creates tables based on SQLModel definitions
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
