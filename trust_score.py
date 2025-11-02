import pandas as pd

def compute_trust_score(path):
    """
    Trust score = percent of completed follow-ups.
    """
    df = pd.read_csv(path)
    if df.empty:
        return 0
    done_count = (df['status'].str.lower() == 'done').sum()
    return int(done_count / len(df) * 100)
