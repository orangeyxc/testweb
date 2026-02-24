// 股票預測引擎 (Stock Prediction Engine)

// 股票數據庫 (Stock database)
const stocksData = [
  // A股 - 上海 (A-shares - Shanghai)
  { symbol: '600519', name: '貴州茅台', market: 'SHSE', sector: '食品飲料', currency: 'CNY', basePrice: 1720.50 },
  { symbol: '601318', name: '中國平安', market: 'SHSE', sector: '保險金融', currency: 'CNY', basePrice: 42.80 },
  { symbol: '601398', name: '工商銀行', market: 'SHSE', sector: '銀行', currency: 'CNY', basePrice: 5.62 },
  { symbol: '600036', name: '招商銀行', market: 'SHSE', sector: '銀行', currency: 'CNY', basePrice: 38.90 },
  { symbol: '601857', name: '中國石油', market: 'SHSE', sector: '能源', currency: 'CNY', basePrice: 8.45 },
  { symbol: '600900', name: '長江電力', market: 'SHSE', sector: '公用事業', currency: 'CNY', basePrice: 25.30 },
  { symbol: '601288', name: '農業銀行', market: 'SHSE', sector: '銀行', currency: 'CNY', basePrice: 4.28 },
  { symbol: '600028', name: '中國石化', market: 'SHSE', sector: '能源', currency: 'CNY', basePrice: 6.75 },
  // A股 - 深圳 (A-shares - Shenzhen)
  { symbol: '000651', name: '格力電器', market: 'SZSE', sector: '家用電器', currency: 'CNY', basePrice: 35.60 },
  { symbol: '000858', name: '五糧液', market: 'SZSE', sector: '食品飲料', currency: 'CNY', basePrice: 148.20 },
  { symbol: '300750', name: '寧德時代', market: 'SZSE', sector: '新能源', currency: 'CNY', basePrice: 218.40 },
  { symbol: '002594', name: '比亞迪', market: 'SZSE', sector: '汽車', currency: 'CNY', basePrice: 285.30 },
  { symbol: '000333', name: '美的集團', market: 'SZSE', sector: '家用電器', currency: 'CNY', basePrice: 62.10 },
  { symbol: '300015', name: '愛爾眼科', market: 'SZSE', sector: '醫療健康', currency: 'CNY', basePrice: 16.80 },
  { symbol: '002415', name: '海康威視', market: 'SZSE', sector: '科技', currency: 'CNY', basePrice: 28.50 },
  { symbol: '000002', name: '萬科A', market: 'SZSE', sector: '房地產', currency: 'CNY', basePrice: 7.20 },
  // 港股 (HK stocks)
  { symbol: '00700', name: '騰訊控股', market: 'HKEX', sector: '科技互聯網', currency: 'HKD', basePrice: 382.20 },
  { symbol: '09988', name: '阿里巴巴', market: 'HKEX', sector: '科技互聯網', currency: 'HKD', basePrice: 78.40 },
  { symbol: '03690', name: '美團', market: 'HKEX', sector: '科技互聯網', currency: 'HKD', basePrice: 142.60 },
  { symbol: '00941', name: '中國移動', market: 'HKEX', sector: '電信', currency: 'HKD', basePrice: 72.35 },
  { symbol: '01299', name: '友邦保險', market: 'HKEX', sector: '保險金融', currency: 'HKD', basePrice: 58.90 },
  { symbol: '02318', name: '中國平安(港)', market: 'HKEX', sector: '保險金融', currency: 'HKD', basePrice: 38.65 },
  { symbol: '00005', name: '匯豐控股', market: 'HKEX', sector: '銀行', currency: 'HKD', basePrice: 68.20 },
  { symbol: '01211', name: '比亞迪(港)', market: 'HKEX', sector: '汽車', currency: 'HKD', basePrice: 248.60 },
  { symbol: '02020', name: '安踏體育', market: 'HKEX', sector: '消費品', currency: 'HKD', basePrice: 76.85 },
  { symbol: '09618', name: '京東集團', market: 'HKEX', sector: '科技互聯網', currency: 'HKD', basePrice: 118.30 },
  { symbol: '00388', name: '香港交易所', market: 'HKEX', sector: '金融', currency: 'HKD', basePrice: 268.40 },
  { symbol: '01024', name: '快手', market: 'HKEX', sector: '科技互聯網', currency: 'HKD', basePrice: 42.15 },
];

// 世界重大事件影響 (Global events impact)
const globalEvents = [
  { event: '美聯儲加息預期升溫', impact: -0.08, affectedSectors: ['銀行', '房地產', '科技互聯網'] },
  { event: '中美貿易談判進展積極', impact: 0.12, affectedSectors: ['科技', '汽車', '消費品'] },
  { event: '地緣政治緊張局勢緩和', impact: 0.06, affectedSectors: ['能源', '科技', '金融'] },
  { event: '中國GDP增速超預期', impact: 0.10, affectedSectors: ['銀行', '消費品', '保險金融'] },
  { event: '全球供應鏈持續改善', impact: 0.07, affectedSectors: ['汽車', '家用電器', '新能源'] },
  { event: '人民幣兌美元企穩回升', impact: 0.05, affectedSectors: ['科技互聯網', '消費品', '食品飲料'] },
  { event: '香港金融市場改革深化', impact: 0.08, affectedSectors: ['銀行', '金融', '保險金融'] },
  { event: '新能源政策持續利好', impact: 0.15, affectedSectors: ['新能源', '汽車'] },
  { event: '房地產調控政策微調', impact: 0.09, affectedSectors: ['房地產', '銀行'] },
  { event: 'AI技術突破帶動科技股', impact: 0.18, affectedSectors: ['科技', '科技互聯網'] },
];

// 行業趨勢分析 (Sector trend analysis)
const sectorTrends = {
  '科技互聯網': { trend: 0.12, outlook: '看好', reason: 'AI浪潮推動板塊估值重估，監管趨向明朗' },
  '新能源': { trend: 0.10, outlook: '看好', reason: '政策持續扶持，滲透率穩步提升' },
  '汽車': { trend: 0.08, outlook: '中性偏好', reason: '新能源車出口強勁，智能化轉型加速' },
  '食品飲料': { trend: 0.05, outlook: '中性', reason: '高端消費復甦，但整體增速放緩' },
  '銀行': { trend: 0.03, outlook: '中性', reason: '息差承壓，但估值偏低具防禦性' },
  '保險金融': { trend: 0.06, outlook: '中性偏好', reason: '壽險需求回暖，財富管理業務增長' },
  '醫療健康': { trend: 0.07, outlook: '中性偏好', reason: '人口老齡化帶動需求，創新藥持續突破' },
  '家用電器': { trend: 0.04, outlook: '中性', reason: '地產鏈弱復甦，以舊換新政策有支撐' },
  '科技': { trend: 0.09, outlook: '看好', reason: '國產替代加速，半導體及安防需求旺盛' },
  '能源': { trend: 0.02, outlook: '中性偏淡', reason: '油價承壓，但分紅收益具吸引力' },
  '公用事業': { trend: 0.04, outlook: '中性', reason: '穩定現金流，利率下行環境受益' },
  '房地產': { trend: -0.05, outlook: '謹慎', reason: '行業去槓桿持續，需關注個別龍頭復甦' },
  '消費品': { trend: 0.06, outlook: '中性偏好', reason: '出口品牌崛起，國潮消費持續' },
  '電信': { trend: 0.03, outlook: '中性', reason: '5G建設進入成熟期，雲計算帶動增長' },
  '金融': { trend: 0.05, outlook: '中性偏好', reason: '資本市場改革利好交易所及投行業務' },
};

// 技術指標模擬 (Simulated technical indicators)
function getTechnicalScore(symbol) {
  // 用symbol的字符碼生成基礎哈希，再加入日期因素使每天略有變化（非完全確定性）
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = ((hash << 5) - hash) + symbol.charCodeAt(i);
    hash |= 0;
  }
  // 加入日期因素使每天略有變化
  const dayFactor = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 100;
  const score = ((Math.abs(hash) + dayFactor * 7919) % 100) / 100;
  return score; // 0-1 之間
}

// 計算股票預測 (Calculate stock prediction)
function predictStock(symbol) {
  const stock = stocksData.find(s => s.symbol === symbol);
  if (!stock) return null;

  const techScore = getTechnicalScore(symbol);

  // 技術分析 (30%)
  const rsi = 10 + techScore * 80; // 10-90 range (oversold < 30, overbought > 70)
  const macdSignal = techScore > 0.5 ? 1 : -1;
  const ma20Trend = techScore > 0.45 ? 'above' : 'below';
  const bollingerPos = techScore * 100; // 0-100% within bands
  const technicalScore = (
    (rsi > 50 ? 0.6 : rsi > 40 ? 0.4 : 0.2) * 0.3 +
    (macdSignal > 0 ? 0.8 : 0.3) * 0.4 +
    (ma20Trend === 'above' ? 0.7 : 0.35) * 0.3
  );

  // 行業趨勢 (25%)
  const sectorTrend = sectorTrends[stock.sector] || { trend: 0, outlook: '中性' };
  const sectorScore = Math.min(1, Math.max(0, 0.5 + sectorTrend.trend * 3));

  // 全球事件影響 (25%)
  let eventImpact = 0;
  const relevantEvents = [];
  globalEvents.forEach(evt => {
    if (evt.affectedSectors.includes(stock.sector)) {
      eventImpact += evt.impact;
      relevantEvents.push(evt);
    }
  });
  const eventScore = Math.min(1, Math.max(0, 0.5 + eventImpact * 2));

  // 市場情緒 (20%)
  const sentimentScore = 0.3 + techScore * 0.4; // varies with tech indicator

  // 綜合評分 (Overall score)
  const overallScore = (
    technicalScore * 0.30 +
    sectorScore * 0.25 +
    eventScore * 0.25 +
    sentimentScore * 0.20
  );

  // 生成建議 (Generate recommendation)
  let recommendation, recColor, recEmoji;
  if (overallScore >= 0.72) {
    recommendation = '強烈買入'; recColor = '#16a34a'; recEmoji = '🚀';
  } else if (overallScore >= 0.58) {
    recommendation = '買入'; recColor = '#22c55e'; recEmoji = '📈';
  } else if (overallScore >= 0.42) {
    recommendation = '觀望'; recColor = '#f59e0b'; recEmoji = '⏳';
  } else if (overallScore >= 0.28) {
    recommendation = '賣出'; recColor = '#ef4444'; recEmoji = '📉';
  } else {
    recommendation = '強烈賣出'; recColor = '#dc2626'; recEmoji = '⚠️';
  }

  // 成功率計算 (Success rate calculation)
  const successRate = Math.round(45 + overallScore * 45); // 45%-90%

  // 價格預測 (Price prediction)
  const priceVariance = (techScore - 0.5) * 0.08; // -4% to +4% daily variance
  const currentPrice = stock.basePrice * (1 + priceVariance);
  const changePercent = priceVariance * 100;
  const change = currentPrice - stock.basePrice;

  // 目標價及止損 (Target price and stop loss)
  let targetReturn, stopLossPercent;
  if (overallScore >= 0.58) {
    targetReturn = 8 + overallScore * 20; // 8-28% upside
    stopLossPercent = -5 - (1 - overallScore) * 5; // -5% to -10%
  } else if (overallScore >= 0.42) {
    targetReturn = -2 + overallScore * 10; // -2% to +8%
    stopLossPercent = -4 - (1 - overallScore) * 6;
  } else {
    targetReturn = -15 + overallScore * 10; // -15% to -5%
    stopLossPercent = -3 - (1 - overallScore) * 7;
  }

  const targetPrice = currentPrice * (1 + targetReturn / 100);
  const stopLossPrice = currentPrice * (1 + stopLossPercent / 100);

  // 預計獲利 (Estimated profit for 100 shares)
  const sharesExample = stock.currency === 'HKD' ? 500 : 100;
  const investAmount = currentPrice * sharesExample;
  const profitAmount = investAmount * (targetReturn / 100);
  const riskAmount = investAmount * (stopLossPercent / 100);

  // 因素分析 (Factor analysis)
  const factors = [
    {
      name: '技術分析',
      score: Math.round(technicalScore * 100),
      detail: `RSI: ${rsi.toFixed(1)} | MACD: ${macdSignal > 0 ? '金叉' : '死叉'} | MA20: 股價${ma20Trend === 'above' ? '在均線上方' : '在均線下方'}`,
      positive: technicalScore > 0.5
    },
    {
      name: '行業趨勢',
      score: Math.round(sectorScore * 100),
      detail: `${sectorTrend.outlook} — ${sectorTrend.reason || '行業整體穩健'}`,
      positive: sectorScore > 0.5
    },
    {
      name: '宏觀事件',
      score: Math.round(eventScore * 100),
      detail: relevantEvents.length > 0
        ? relevantEvents.slice(0, 2).map(e => e.event).join('；')
        : '暫無重大事件影響',
      positive: eventScore > 0.5
    },
    {
      name: '市場情緒',
      score: Math.round(sentimentScore * 100),
      detail: sentimentScore > 0.6 ? '市場情緒樂觀，資金流入跡象' :
              sentimentScore > 0.4 ? '市場情緒中性，觀望氣氛較重' :
              '市場情緒謹慎，避險需求上升',
      positive: sentimentScore > 0.5
    }
  ];

  return {
    ...stock,
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    recommendation,
    recColor,
    recEmoji,
    successRate,
    overallScore: Math.round(overallScore * 100),
    targetPrice: parseFloat(targetPrice.toFixed(2)),
    stopLossPrice: parseFloat(stopLossPrice.toFixed(2)),
    targetReturn: parseFloat(targetReturn.toFixed(1)),
    stopLossPercent: parseFloat(stopLossPercent.toFixed(1)),
    sharesExample,
    investAmount: parseFloat(investAmount.toFixed(0)),
    profitAmount: parseFloat(profitAmount.toFixed(0)),
    riskAmount: parseFloat(riskAmount.toFixed(0)),
    factors,
    relevantEvents: relevantEvents.slice(0, 3),
    sectorTrend,
    rsi: parseFloat(rsi.toFixed(1)),
    macdSignal: macdSignal > 0 ? '金叉 (買入信號)' : '死叉 (賣出信號)',
    ma20Trend: ma20Trend === 'above' ? '股價在MA20均線上方' : '股價在MA20均線下方',
  };
}

// 獲取所有股票的基本預測 (Get basic prediction for all stocks)
function getAllStocks() {
  return stocksData.map(stock => {
    const techScore = getTechnicalScore(stock.symbol);
    const priceVariance = (techScore - 0.5) * 0.08;
    const currentPrice = stock.basePrice * (1 + priceVariance);
    const change = currentPrice - stock.basePrice;
    const changePercent = priceVariance * 100;

    // Quick overall score
    const sectorTrend = sectorTrends[stock.sector] || { trend: 0 };
    const sectorScore = Math.min(1, Math.max(0, 0.5 + sectorTrend.trend * 3));
    const techAnalysisScore = techScore;
    const overallScore = techAnalysisScore * 0.5 + sectorScore * 0.5;

    let recommendation;
    if (overallScore >= 0.70) recommendation = '強烈買入';
    else if (overallScore >= 0.56) recommendation = '買入';
    else if (overallScore >= 0.42) recommendation = '觀望';
    else if (overallScore >= 0.28) recommendation = '賣出';
    else recommendation = '強烈賣出';

    const successRate = Math.round(45 + overallScore * 45);

    return {
      ...stock,
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      recommendation,
      successRate,
    };
  });
}

module.exports = { getAllStocks, predictStock, stocksData, globalEvents };
