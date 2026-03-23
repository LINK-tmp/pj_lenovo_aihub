import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.useCase.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // ── ログイン用アカウント 3つ ──────────────────────────
  const admin = await prisma.user.create({ data: {
    email: "admin@kansai-aihub.jp", passwordHash: hash("admin123"),
    name: "田中 太郎", organizationName: "関西AI Hub 事務局",
    organizationDesc: "関西AI Hubの事務局として、企業と大学・会員企業のマッチングを推進します。",
    role: "ADMIN",
  }});

  const loginEnt = await prisma.user.create({ data: {
    email: "enterprise@example.co.jp", passwordHash: hash("pass123"),
    name: "山田 一郎", organizationName: "サンプル製造株式会社",
    organizationDesc: "関西を拠点とする総合製造企業。自動車部品・産業機械の設計製造を手がけ、DX推進に注力しています。",
    role: "ENTERPRISE",
  }});

  const loginMem = await prisma.user.create({ data: {
    email: "member@example.ac.jp", passwordHash: hash("pass123"),
    name: "佐藤 健太", organizationName: "関西工業大学 工学研究科",
    organizationDesc: "AI・機械学習を専門とする研究室。物流最適化や製造業向けAIの研究実績多数。",
    role: "MEMBER",
  }});

  // ── 追加企業（ログイン不要・データ用） ──────────────────────────
  const ent2 = await prisma.user.create({ data: {
    email: "suzuki@delta-logistics.example.co.jp", passwordHash: hash("noLogin"),
    name: "鈴木 花子", organizationName: "デルタ物流株式会社",
    organizationDesc: "関西圏を中心に物流ネットワークを展開。EC向けラストワンマイル配送からBtoB大型物流まで対応。",
    role: "ENTERPRISE",
  }});
  const ent3 = await prisma.user.create({ data: {
    email: "tanaka@osaka-foods.example.co.jp", passwordHash: hash("noLogin"),
    name: "田中 裕介", organizationName: "大阪フーズ株式会社",
    organizationDesc: "関西の食品メーカー。安全・安心な食品づくりとともに、食品ロス削減やスマート工場化に取り組んでいます。",
    role: "ENTERPRISE",
  }});
  const ent4 = await prisma.user.create({ data: {
    email: "nakamura@kansai-energy.example.co.jp", passwordHash: hash("noLogin"),
    name: "中村 由美", organizationName: "関西エネルギー株式会社",
    organizationDesc: "再生可能エネルギーの開発・運用を行うエネルギー企業。スマートグリッドやエネルギー管理の先端技術に注力。",
    role: "ENTERPRISE",
  }});
  const ent5 = await prisma.user.create({ data: {
    email: "ito@namba-retail.example.co.jp", passwordHash: hash("noLogin"),
    name: "伊藤 健二", organizationName: "なんばリテール株式会社",
    organizationDesc: "大阪・難波を拠点にした大型小売チェーン。店舗DXと顧客体験の最適化を推進中。",
    role: "ENTERPRISE",
  }});

  // ── 追加会員（ログイン不要・データ用） ──────────────────────────
  const mem2 = await prisma.user.create({ data: {
    email: "takahashi@ai-solutions.example.co.jp", passwordHash: hash("noLogin"),
    name: "高橋 美咲", organizationName: "AIソリューションズ株式会社",
    organizationDesc: "物流DX専門のAIスタートアップ。倉庫最適化・需要予測のソリューションを20社以上に提供。",
    role: "MEMBER",
  }});
  const mem3 = await prisma.user.create({ data: {
    email: "watanabe@nishinihon-tech.example.ac.jp", passwordHash: hash("noLogin"),
    name: "渡辺 修", organizationName: "西日本工科大学 情報学部",
    organizationDesc: "画像認識・エッジコンピューティングの研究拠点。製造業との産学連携プロジェクト多数。",
    role: "MEMBER",
  }});
  const mem4 = await prisma.user.create({ data: {
    email: "kimura@green-tech.example.co.jp", passwordHash: hash("noLogin"),
    name: "木村 太一", organizationName: "グリーンテック株式会社",
    organizationDesc: "環境・エネルギー分野のテクノロジー企業。IoTセンサーとAIを組み合わせたエネルギー最適化を得意とする。",
    role: "MEMBER",
  }});
  const mem5 = await prisma.user.create({ data: {
    email: "yamamoto@data-insight.example.co.jp", passwordHash: hash("noLogin"),
    name: "山本 彩", organizationName: "データインサイト株式会社",
    organizationDesc: "データ分析・BI構築の専門企業。小売・金融向けの分析基盤構築で多数の実績。",
    role: "MEMBER",
  }});

  const allEnts = [loginEnt, ent2, ent3, ent4, ent5];
  const allMems = [loginMem, mem2, mem3, mem4, mem5];

  // ── ユースケース 20件（企業5社に分散） ──────────────────────────
  const caseData: { title: string; company: typeof loginEnt; industry: string; techs: string[]; budget: string; target: string; status: string; published: boolean }[] = [
    { title: "物流倉庫の入出庫最適化AIの開発パートナー募集", company: loginEnt, industry: "物流", techs: ["AI/ML","データ分析"], budget: "UNDER_5M", target: "BOTH", status: "OPEN", published: true },
    { title: "工場ラインの品質検査自動化システム", company: loginEnt, industry: "製造", techs: ["AI/ML","画像認識"], budget: "UNDER_3M", target: "BOTH", status: "OPEN", published: true },
    { title: "工場設備の予兆保全AIプラットフォーム", company: loginEnt, industry: "製造", techs: ["AI/ML","IoT"], budget: "UNDER_10M", target: "BOTH", status: "OPEN", published: true },
    { title: "自然言語処理による契約書レビュー自動化", company: loginEnt, industry: "IT・通信", techs: ["AI/ML","自然言語処理"], budget: "UNDER_5M", target: "COMPANY", status: "UNDER_REVIEW", published: false },
    { title: "配送ルート最適化システムの構築", company: ent2, industry: "物流", techs: ["AI/ML","IoT","データ分析"], budget: "UNDER_10M", target: "UNIVERSITY", status: "OPEN", published: true },
    { title: "倉庫内自動搬送ロボット制御AI", company: ent2, industry: "物流", techs: ["AI/ML","ロボティクス","IoT"], budget: "OVER_10M", target: "BOTH", status: "OPEN", published: true },
    { title: "配送需要予測と車両台数最適化", company: ent2, industry: "物流", techs: ["AI/ML","データ分析"], budget: "UNDER_5M", target: "BOTH", status: "IN_PROGRESS", published: true },
    { title: "食品工場の異物検知AIシステム", company: ent3, industry: "農業・食品", techs: ["AI/ML","画像認識"], budget: "UNDER_5M", target: "BOTH", status: "OPEN", published: true },
    { title: "食品ロス削減のための需要予測システム", company: ent3, industry: "農業・食品", techs: ["AI/ML","データ分析"], budget: "UNDER_3M", target: "BOTH", status: "OPEN", published: true },
    { title: "農作物の生育状況モニタリングAI", company: ent3, industry: "農業・食品", techs: ["AI/ML","画像認識","IoT"], budget: "UNDER_3M", target: "UNIVERSITY", status: "OPEN", published: true },
    { title: "スマートグリッド向けエネルギー需要予測", company: ent4, industry: "エネルギー", techs: ["AI/ML","IoT","データ分析"], budget: "UNDER_10M", target: "BOTH", status: "OPEN", published: true },
    { title: "太陽光パネル劣化検知AIシステム", company: ent4, industry: "エネルギー", techs: ["AI/ML","画像認識","IoT"], budget: "UNDER_5M", target: "UNIVERSITY", status: "OPEN", published: true },
    { title: "EV充電ステーション最適配置シミュレーション", company: ent4, industry: "エネルギー", techs: ["AI/ML","データ分析"], budget: "UNDER_5M", target: "BOTH", status: "UNDER_REVIEW", published: false },
    { title: "店舗来客数予測と人員配置最適化", company: ent5, industry: "小売", techs: ["AI/ML","データ分析"], budget: "UNDER_5M", target: "COMPANY", status: "OPEN", published: true },
    { title: "顧客行動分析によるレコメンドエンジン", company: ent5, industry: "小売", techs: ["AI/ML","データ分析"], budget: "UNDER_3M", target: "COMPANY", status: "OPEN", published: true },
    { title: "店舗内カメラによる棚卸自動化", company: ent5, industry: "小売", techs: ["AI/ML","画像認識"], budget: "UNDER_5M", target: "BOTH", status: "OPEN", published: true },
    { title: "建設現場の安全管理AIカメラシステム", company: loginEnt, industry: "建設・不動産", techs: ["AI/ML","画像認識","IoT"], budget: "UNDER_5M", target: "BOTH", status: "OPEN", published: true },
    { title: "医療画像の自動診断支援システム", company: loginEnt, industry: "医療・ヘルスケア", techs: ["AI/ML","画像認識"], budget: "UNDER_10M", target: "UNIVERSITY", status: "OPEN", published: true },
    { title: "AR/VRを活用した遠隔設備保守支援", company: loginEnt, industry: "製造", techs: ["AR/VR","AI/ML","IoT"], budget: "UNDER_5M", target: "BOTH", status: "DRAFT", published: false },
    { title: "金融取引の不正検知AIプラットフォーム", company: loginEnt, industry: "金融", techs: ["AI/ML","データ分析","セキュリティ"], budget: "OVER_10M", target: "COMPANY", status: "DRAFT", published: false },
  ];

  const summaries = [
    "自社の物流倉庫における入出庫の最適化を目指し、AIを活用した需要予測と連動した自動配置システムの開発パートナーを募集します。",
    "製造ラインにおける目視検査を画像認識AIで自動化し、品質管理の精度向上とコスト削減を実現したい。不良品検出率99.5%以上を目指します。",
    "工場内の各設備にセンサーを設置し、故障を事前に予測することで計画的な保全を実現したい。ダウンタイム年間50%削減が目標。",
    "取引先との契約書をAIで自動レビューし、リスク条項の検出や過去契約との比較分析を行うシステムの開発。法務業務効率50%改善が目標。",
    "関西圏の配送ネットワークにおけるルート最適化をAIで実現し、配送コスト15%削減とCO2排出量低減を目指します。",
    "倉庫内の搬送作業をAMR（自律移動ロボット）で自動化。ピッキング効率200%向上を目標とした制御AIの開発。",
    "過去の配送実績と天候・イベント情報から日次の配送需要を予測し、必要車両台数を最適化するシステムの開発。",
    "食品製造ラインにおける異物混入を高精度で検知するAIシステム。HACCP対応の品質管理体制強化の一環です。",
    "食品の賞味期限と販売データを活用し、廃棄を最小化する生産量最適化システム。SDGs目標12への貢献を目指す。",
    "ドローンとAIを活用した農作物の生育状況自動モニタリング。病害虫の早期検知や最適な収穫時期の予測を実現。",
    "再生可能エネルギーの発電量と消費量を高精度に予測し、電力需給バランスの最適化を実現するAIモデルの開発。",
    "ドローン・地上カメラの画像からソーラーパネルのホットスポットやマイクロクラックを自動検出。メンテナンスコスト30%削減を目標。",
    "人口動態・交通量・商業施設分布データを用いたEV充電ステーションの最適配置シミュレーション。5年後の需要予測も含む。",
    "各店舗の来客数をAIで予測し、最適な人員配置とシフト計画を自動生成。人件費10%削減しながら顧客満足度維持。",
    "購買履歴・閲覧行動・属性データを統合したリアルタイムレコメンドエンジン。オンライン・店舗双方で活用可能。",
    "店舗天井カメラの画像をAIで解析し、商品棚の在庫状況をリアルタイム把握。欠品率を50%改善する。",
    "建設現場に設置したカメラ映像をAIで解析し、危険行動や安全違反をリアルタイム検知。労災事故ゼロを目指す。",
    "胸部X線・CT画像のAI自動読影支援。放射線科医の負担軽減と診断精度向上を目指す。",
    "ARグラスを通じてベテラン技術者が遠隔から現場作業者を支援するシステム。技術継承と保守効率化の両立。",
    "オンライン決済における不正取引をリアルタイム検知。誤検知率を下げつつ不正検出率99%以上を実現。",
  ];

  const challenges = [
    "手作業でのピッキング指示で繁忙期に出荷遅延が発生。出荷データは蓄積されているが活用できていない。",
    "熟練工による目視検査に依存。検査員の高齢化と人材不足が課題。夜間シフトで特に精度低下。",
    "突発的な設備故障により年間5回以上の生産ライン停止。1回の停止で約500万円の損失。",
    "年間500件以上の契約書レビューを少人数で対応。見落としリスクと業務負荷が限界。英文契約書対応も追いつかない。",
    "配送ドライバーの経験に依存したルート設定。大阪市内の渋滞パターンへの対応が不十分。",
    "人手によるフォークリフト搬送が主力だがオペレーター確保が年々困難。夜間無人化への要望が強い。",
    "天候やセール時の急激な需要変動に対応できず、車両の空車率が20%を超える日がある。",
    "既存の金属探知機では非金属異物を検出できない。誤検出率1%未満とライン速度維持の両立が必要。",
    "季節変動やプロモーション影響で需要予測が難しく、食品廃棄率が年間8%に達している。",
    "広大な農地の巡回に多大な人手と時間。病害虫の早期発見が遅れ被害拡大。ベテラン農家の引退で暗黙知が消失中。",
    "太陽光・風力の発電量は天候に左右され需要との乖離が課題。蓄電池の運用コストが増大。",
    "大規模ソーラーファーム（10MW以上）の定期点検に多大なコストと時間。故障の早期発見が遅れ発電効率が低下。",
    "充電ステーションの設置コストが高く、投資対効果の見極めが困難。既存データの分析基盤がない。",
    "店舗ごとに来客パターンが異なり経験則のシフト作成では人手不足や過剰配置が頻発。",
    "ECサイトのコンバージョン率が業界平均を下回る。パーソナライゼーション不足が原因と推測。",
    "棚卸作業に月間延べ200人時を投入。人的ミスによる在庫データ不一致が月平均3%発生。",
    "安全管理者の目視巡回では現場全体をカバーできず危険行為の見逃しが発生。",
    "医師の人手不足で読影待ち時間が増加。夜間・休日の緊急読影体制が課題。",
    "設備の高度化に伴い保守に専門知識が必要だが、熟練技術者が全国の現場に出向くのは非効率。",
    "不正手口が日々巧妙化しルールベース検知では対応困難。正常取引の誤ブロックで顧客離脱も深刻。",
  ];

  const cases = [];
  for (let i = 0; i < caseData.length; i++) {
    const d = caseData[i];
    cases.push(await prisma.useCase.create({ data: {
      title: d.title,
      companyName: d.company.organizationName,
      summary: summaries[i],
      challenge: challenges[i],
      expectedDev: `本案件に対応可能な技術パートナーを募集しています。PoC期間3ヶ月程度を想定。`,
      industry: d.industry,
      technologies: d.techs,
      budgetRange: d.budget as never,
      targetAudience: d.target as never,
      status: d.status as never,
      isPublished: d.published,
      createdById: d.company.id,
    }}));
  }

  // ── 応募 15件（会員5組織に分散） ──────────────────────────
  const appData: { memIdx: number; caseIdx: number; status: string; summary: string }[] = [
    { memIdx: 0, caseIdx: 0, status: "UNDER_REVIEW", summary: "深層強化学習を用いた倉庫内ロボットの経路最適化を提案。当研究室では3年間の物流最適化研究実績があります。" },
    { memIdx: 1, caseIdx: 0, status: "NEW", summary: "物流DX専門企業として20社以上の倉庫最適化実績。RFIDとAIを組み合わせたリアルタイム在庫管理を提案します。" },
    { memIdx: 2, caseIdx: 1, status: "NEW", summary: "画像認識による不良品検出の研究実績あり。GPU搭載エッジデバイス（Jetson）での低遅延処理に強み。" },
    { memIdx: 0, caseIdx: 2, status: "APPROVED", summary: "IoTセンサーデータの異常検知アルゴリズム研究を3年間実施。製造業3社との共同研究実績。" },
    { memIdx: 3, caseIdx: 4, status: "NEW", summary: "組合せ最適化と機械学習を融合した配送ルート最適化の研究。VRP近似解法に強み。" },
    { memIdx: 0, caseIdx: 5, status: "UNDER_REVIEW", summary: "自律移動ロボットの制御AI研究を5年間実施。ROS2ベースのナビゲーション開発に対応可能。" },
    { memIdx: 4, caseIdx: 6, status: "APPROVED", summary: "小売・物流向け需要予測の分析基盤を10社以上に構築。天候・イベントデータ統合が得意。" },
    { memIdx: 2, caseIdx: 7, status: "UNDER_REVIEW", summary: "X線画像解析とVision Transformerを組み合わせた高精度異物検知アルゴリズムを開発中。" },
    { memIdx: 0, caseIdx: 8, status: "NEW", summary: "時系列予測モデル（LSTM/Transformer）と食品ドメイン知識を組み合わせた需要予測を提案。" },
    { memIdx: 3, caseIdx: 10, status: "NEW", summary: "IoTセンサーとクラウドAI連携のエネルギー管理システム開発実績多数。気象データAPI統合も対応可能。" },
    { memIdx: 0, caseIdx: 11, status: "UNDER_REVIEW", summary: "ドローン画像解析の研究実績を活かし、ソーラーパネルの異常検知AIを構築可能。YOLOv8ベース。" },
    { memIdx: 4, caseIdx: 13, status: "APPROVED", summary: "POSデータ分析と来客予測の分析基盤構築を5社以上に提供。天候・近隣イベントデータ統合が強み。" },
    { memIdx: 1, caseIdx: 14, status: "NEW", summary: "推薦システムの開発実績多数。協調フィルタリングとコンテンツベースのハイブリッドアプローチを提案。" },
    { memIdx: 2, caseIdx: 16, status: "NEW", summary: "YOLOv8ベースの物体検出で建設現場向け安全管理AI開発経験あり。ヘルメット検出精度98%。" },
    { memIdx: 0, caseIdx: 17, status: "UNDER_REVIEW", summary: "医用画像解析の論文5本以上発表。RSNA国際コンペ上位入賞実績。大学病院との連携体制構築済み。" },
  ];

  for (const a of appData) {
    await prisma.application.create({ data: {
      organizationName: allMems[a.memIdx].organizationName,
      contactName: allMems[a.memIdx].name,
      contactEmail: allMems[a.memIdx].email,
      proposalSummary: a.summary,
      status: a.status as never,
      useCaseId: cases[a.caseIdx].id,
      applicantId: allMems[a.memIdx].id,
    }});
  }

  // ── アクティビティログ ──────────────────────────
  const logEntries: { action: string; detail: string; userId: string; caseIdx: number; daysAgo: number }[] = [];

  // 全ケースに投稿・公開ログ
  for (let i = 0; i < cases.length; i++) {
    const d = caseData[i];
    const age = 35 - i;
    logEntries.push({ action: "案件投稿", detail: `「${d.title}」を投稿`, userId: d.company.id, caseIdx: i, daysAgo: age });
    if (d.published) {
      logEntries.push({ action: "公開設定変更", detail: "案件を公開に設定", userId: admin.id, caseIdx: i, daysAgo: age - 1 });
    }
  }

  // 応募ログ
  for (const a of appData) {
    logEntries.push({
      action: "応募",
      detail: `${allMems[a.memIdx].organizationName}が応募`,
      userId: allMems[a.memIdx].id,
      caseIdx: a.caseIdx,
      daysAgo: Math.max(1, 20 - a.caseIdx),
    });
    if (a.status === "APPROVED") {
      logEntries.push({
        action: "応募ステータス変更",
        detail: "応募を承認",
        userId: admin.id,
        caseIdx: a.caseIdx,
        daysAgo: Math.max(1, 15 - a.caseIdx),
      });
    }
  }

  for (const log of logEntries) {
    await prisma.activityLog.create({ data: {
      action: log.action,
      detail: log.detail,
      userId: log.userId,
      useCaseId: cases[log.caseIdx].id,
      createdAt: new Date(Date.now() - log.daysAgo * 24 * 60 * 60 * 1000),
    }});
  }

  const appCount = appData.length;
  console.log(`Seed completed! Users: ${3 + 4 + 4}, Cases: ${cases.length}, Applications: ${appCount}, Logs: ${logEntries.length}`);
  console.log("");
  console.log("Login accounts:");
  console.log("  事務局:  admin@kansai-aihub.jp / admin123");
  console.log("  企業:    enterprise@example.co.jp / pass123");
  console.log("  会員:    member@example.ac.jp / pass123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
