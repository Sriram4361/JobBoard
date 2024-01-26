import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def scrapeGitHub(firstRow):
    url = 'https://github.com/SimplifyJobs/Summer2024-Internships'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table')
        first_row_date = firstRow[4].strftime('%b %d')
        print("firstRow", firstRow, first_row_date)
        table_data = []
        rows=table.find_all('tr')[1:]
        cur_company=""
        for row in rows:
            row_data = []
            for cell in row.find_all('td'):
                anchor = cell.find('a')
                if anchor:
                    href = anchor.get('href')
                    row_data.append(href)
                else:
                    row_data.append(cell.text.strip())
            if(row_data[0]!='↳'):
                cur_company=row_data[0]
            if(cur_company==firstRow[0] and row_data[1]==firstRow[1] and row_data[2]==firstRow[2] and row_data[4]==first_row_date):
                table_data.reverse()
                return table_data
            table_data.append(row_data)
        table_data.reverse()
        return table_data
    else:
        return None