import requests
import json
from bs4 import BeautifulSoup
import pandas as pd
from io import StringIO
import re

pd.options.display.max_columns = None


def clean_cell_text(text):
    if not isinstance(text, str):
        text = str(text)

    text = text.split(",")[0]
    text = text.replace('[', '').replace(']', '')    
    text = text.strip()
    return text


def clean_dataframe(df):
    if df is None or df.empty:
        return df
    df_cleaned = df.copy()
    for column in df_cleaned.columns:
        df_cleaned[column] = df_cleaned[column].astype(str).apply(clean_cell_text)
    return df_cleaned


INFINITIVE = "existir"
url = f"https://www.spanishdict.com/conjugate/{INFINITIVE}"

res = requests.get(url)
html = res.content
soup = BeautifulSoup(html, 'html.parser')

for i, table in enumerate(soup.find_all('table')):
    print(f"\n--- Processing Table {i+1} ---")

    table_title = ""
    try:
        grandparent_div = table.parent.parent
        if grandparent_div:
            first_div = grandparent_div.find('div')
            if first_div:
                link_element = first_div.find('a')
                if link_element:
                    table_title = link_element.get_text(strip=True)
        table_title = table_title.replace(f' of "{INFINITIVE}"', '').strip()
    except:
        table_title = "Unknown Table"

    try:
        # Read the table
        df_list = pd.read_html(StringIO(table.prettify()), header=0)
        if df_list:
            df = df_list[0]  # Get the first (and usually only) DataFrame
            
            # Clean the DataFrame
            df_cleaned = clean_dataframe(df)
            
            print(f"Table Title: {table_title}")
            print("Cleaned DataFrame:")
            print(df_cleaned)
            print("\n")
        else:
            print(f"Table Title: {table_title}")
            print("No data found in table")
            print("\n")
    except Exception as e:
        print(f"Table Title: {table_title}")
        print(f"Error processing table: {e}")
        print("\n")


