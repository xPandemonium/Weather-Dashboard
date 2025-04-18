import fs from 'node:fs/promises';

interface CityHistory {
  id: string;
  city: string;
}

const historyFilePath = `db/db.json`;

class HistoryService {
  private static async readHistory(): Promise<CityHistory[]> {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private static writeHistory(history: CityHistory[]): void {
    fs.writeFile(historyFilePath, JSON.stringify(history, null, 2));
  }

  static async saveCity(city: string): Promise<void> {
    const history = await this.readHistory();
    const id = (Math.random() * 100000).toString(); 
    history.push({ id, city });
    this.writeHistory(history);
  }

  static async getHistory(): Promise<CityHistory[]> {
    return this.readHistory();
  }

  static async deleteCity(id: string): Promise<void> {
    let history = await this.readHistory();
    history = history.filter(city => city.id !== id);
    this.writeHistory(history);
  }
}

export default HistoryService;