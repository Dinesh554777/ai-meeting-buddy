import pandas as pd

def load_reminders(path):
    df = pd.read_csv(path)
    return df.to_dict(orient='records')

def save_reminder(path, item):
    df = pd.read_csv(path)
    df = pd.concat([df, pd.DataFrame([item])], ignore_index=True)
    df.to_csv(path, index=False)
