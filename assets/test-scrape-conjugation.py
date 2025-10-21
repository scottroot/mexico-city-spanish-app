import requests
import json
from bs4 import BeautifulSoup
import pandas as pd


def scrape_table_to_pandas_bs4(table):
    """
    Scrape a table to pandas DataFrame with proper title extraction and header handling.
    
    Args:
        table: BeautifulSoup table element
        
    Returns:
        dict with 'title' and 'dataframe' keys, or None if parsing fails
    """
    
    # Extract table title from grandparent div
    table_title = None
    try:
        # Get the grandparent div (parent of table's parent div)
        grandparent_div = table.parent.parent
        if grandparent_div:
            # Get the first div in the grandparent
            first_div = grandparent_div.find('div')
            if first_div:
                # Find the <a> element and get its text
                link_element = first_div.find('a')
                if link_element:
                    table_title = link_element.get_text(strip=True)
    except:
        table_title = "Unknown Table"
    
    # Extract headers (th elements) - handle multiple header columns properly
    headers = []
    header_row = table.find('tr')
    if header_row:
        for th in header_row.find_all('th'):
            # Extract text from nested elements, specifically from <a> tags
            link_element = th.find('a')
            if link_element:
                header_text = link_element.get_text(strip=True)
            else:
                header_text = th.get_text(strip=True)
            
            if header_text:  # Only add non-empty headers
                headers.append(header_text)
    
    # Extract data rows
    rows = []
    for tr in table.find_all('tr')[1:]:  # Skip header row
        row_data = []
        cells = tr.find_all(['td', 'th'])
        
        for cell in cells:
            # Extract text from nested elements, specifically from <a> tags in conjugation cells
            link_element = cell.find('a')
            if link_element:
                cell_text = link_element.get_text(strip=True)
            else:
                cell_text = cell.get_text(strip=True)
            row_data.append(cell_text)
        
        if row_data:  # Only add non-empty rows
            rows.append(row_data)
    
    # Create DataFrame
    if headers and rows:
        # Ensure all rows have the same length as headers
        max_cols = len(headers)
        for row in rows:
            while len(row) < max_cols:
                row.append('')
            if len(row) > max_cols:
                row = row[:max_cols]
        
        try:
            df = pd.DataFrame(rows, columns=headers)
            return {
                'title': table_title,
                'dataframe': df
            }
        except Exception as e:
            print(f"Failed to create DataFrame: {e}")
            print(f"Row that failed: {row}")
    
    return None

url = "https://www.spanishdict.com/conjugate/existir"

res = requests.get(url)
html = res.content
soup = BeautifulSoup(html, 'html.parser')

for table in soup.find_all('table'):
    result = scrape_table_to_pandas_bs4(table)
    if result:
        print(f"\n=== Table Title: {result['title']} ===")
        print(result['dataframe'])
        print("\n" + "="*50)
    else:
        print("FUCK")

# print(soup.get_text())