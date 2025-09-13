const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();
const port = process.env.PORT || 3000;

// ミドルウェア
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

// 動的ルートの設定
const routesConfig = {
  '/api/users': './data/users.json',
  '/api/posts': './data/posts.json',
  '/api/comments': './data/comments.json',
  '/api/products': './data/products.json'
};

// ファイルからJSONデータを読み込む関数
function loadJsonData(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      const data = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return [];
  }
}

// JSONデータをファイルに保存する関数
function saveJsonData(filePath, data) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
    return false;
  }
}

// 設定に基づいて動的ルートを設定
Object.entries(routesConfig).forEach(([route, filePath]) => {
  const routeName = route.split('/').pop();

  // 全てのアイテムを取得
  server.get(route, (req, res) => {
    const data = loadJsonData(filePath);
    res.json(data);
  });

  // IDでアイテムを取得
  server.get(`${route}/:id`, (req, res) => {
    const data = loadJsonData(filePath);
    const item = data.find(item => item.id == req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: `${routeName.slice(0, -1)} not found` });
    }
  });

  // 新しいアイテムを作成
  server.post(route, (req, res) => {
    const data = loadJsonData(filePath);
    const newItem = {
      id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
      ...req.body
    };
    data.push(newItem);
    if (saveJsonData(filePath, data)) {
      res.status(201).json(newItem);
    } else {
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

  // IDでアイテムを更新
  server.put(`${route}/:id`, (req, res) => {
    const data = loadJsonData(filePath);
    const index = data.findIndex(item => item.id == req.params.id);
    if (index !== -1) {
      data[index] = { id: parseInt(req.params.id), ...req.body };
      if (saveJsonData(filePath, data)) {
        res.json(data[index]);
      } else {
        res.status(500).json({ error: 'Failed to save data' });
      }
    } else {
      res.status(404).json({ error: `${routeName.slice(0, -1)} not found` });
    }
  });

  // IDでアイテムを削除
  server.delete(`${route}/:id`, (req, res) => {
    const data = loadJsonData(filePath);
    const index = data.findIndex(item => item.id == req.params.id);
    if (index !== -1) {
      const deletedItem = data.splice(index, 1)[0];
      if (saveJsonData(filePath, data)) {
        res.json(deletedItem);
      } else {
        res.status(500).json({ error: 'Failed to save data' });
      }
    } else {
      res.status(404).json({ error: `${routeName.slice(0, -1)} not found` });
    }
  });
});

// ルートエンドポイント
server.get('/', (req, res) => {
  res.json({
    message: '汎用JSON APIサーバー',
    available_endpoints: Object.keys(routesConfig),
    instructions: {
      add_new_api: {
        step1: './data/ディレクトリにJSONファイルを作成',
        step2: 'server.jsのroutesConfigにルートマッピングを追加',
        step3: 'サーバーを再起動'
      }
    }
  });
});

// サーバー開始
server.listen(port, () => {
  console.log(`JSONサーバーが http://localhost:${port} で実行中`);
  console.log('利用可能なエンドポイント:');
  Object.keys(routesConfig).forEach(route => {
    console.log(`  ${route}`);
  });
});