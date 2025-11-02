import pandas as pd

def calculate_points(path):
    """
    Completed follow-ups: 10 points, pending: 2 points.
    """
    df = pd.read_csv(path)
    df['points'] = df['status'].apply(lambda s: 10 if s.lower() == 'done' else 2)
    return int(df['points'].sum())
