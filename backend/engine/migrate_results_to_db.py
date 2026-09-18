"""
backend/engine/migrate_results_to_db.py
Migrates Monte Carlo simulation results from pickle files into the Gridiron SQLite database.
"""
import os
import pickle
from sqlmodel import Session, SQLModel, Field, create_engine, select

# --- 1. Define the Database Schema ---
class SeasonSimulation(SQLModel, table=True):
    """Database model for storing Monte Carlo simulation outputs."""
    id: int | None = Field(default=None, primary_key=True)
    filename: str = Field(index=True, unique=True)
    home_team: str
    away_team: str
    p_home_win: float
    p_away_win: float
    p_tie: float
    pred_spread_median: float
    true_h_win: float
    true_h_minus_a: float
    n_sims: int

# --- 2. Database Connection Setup ---
sqlite_file_name = "franchise.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables():
    """Generates the table if it does not already exist."""
    SQLModel.metadata.create_all(engine)

# --- 3. Migration Logic ---
def migrate_pickles_to_sqlite(pickle_dir="results_save"):
    """Reads all .pkl files in the directory and inserts them into SQLite."""
    if not os.path.exists(pickle_dir):
        os.makedirs(pickle_dir, exist_ok=True)
        print(f"Directory '{pickle_dir}' created. Add .pkl simulation files to migrate.")
        return

    print("Initializing database tables...")
    create_db_and_tables()
    
    files_processed = 0
    print(f"Scanning '{pickle_dir}' for simulation results...")
    
    with Session(engine) as session:
        for filename in os.listdir(pickle_dir):
            if not filename.endswith(".pkl"):
                continue
                
            filepath = os.path.join(pickle_dir, filename)
            
            # Skip if this file has already been imported
            statement = select(SeasonSimulation).where(SeasonSimulation.filename == filename)
            existing_record = session.exec(statement).first()
            if existing_record:
                continue

            try:
                with open(filepath, "rb") as f:
                    data = pickle.load(f)
                
                # Extract dictionary values safely, defaulting if a key is missing
                sim_record = SeasonSimulation(
                    filename=filename,
                    home_team=data.get('home', 'UNKNOWN'),
                    away_team=data.get('away', 'UNKNOWN'),
                    p_home_win=data.get('p_home_win', 0.0),
                    p_away_win=data.get('p_away_win', 0.0),
                    p_tie=data.get('p_tie', 0.0),
                    pred_spread_median=data.get('pred_spread_median', 0.0),
                    true_h_win=data.get('True_H_win', 0.0),
                    true_h_minus_a=data.get('True_H_minus_A', 0.0),
                    n_sims=data.get('n_sims', 0)
                )
                
                session.add(sim_record)
                files_processed += 1
                
            except Exception as e:
                print(f"⚠️ Error processing {filename}: {e}")

        # Commit all new records to the database
        session.commit()
        
    print(f"✅ Migration complete. {files_processed} new simulation records added to the database.")

if __name__ == "__main__":
    # Execute the migration
    migrate_pickles_to_sqlite()
