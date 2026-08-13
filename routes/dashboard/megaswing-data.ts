export type MegaSwingObjectKind =
	| 'character'
	| 'scene'
	| 'theme'
	| 'motif'
	| 'question'
	| 'fact';

export type MegaSwingSceneRef = {
	id: string;
	order: string;
	title: string;
	role?: string;
};

export type MegaSwingMetric = {
	label: string;
	value: number;
	max: number;
};

export type MegaSwingQA = {
	question: string;
	answer: string;
};

export type MegaSwingMotifStep = {
	label: string;
	state: 'on' | 'off';
};

export type MegaSwingMotif = {
	label: string;
	steps: MegaSwingMotifStep[];
};

export type MegaSwingObject = {
	id: string;
	kind: MegaSwingObjectKind;
	title: string;
	glyph: string;
	meta: string;
	summary: string;
	identity: Array<{ label: string; value: string }>;
	scenes: MegaSwingSceneRef[];
	situations: string[];
	themes: MegaSwingMetric[];
	knowledge: Array<{ label: string; known: boolean }>;
	qa: MegaSwingQA[];
	motifs: MegaSwingMotif[];
	relations: string[];
	locations: string[];
	symbols: string[];
	manuscript: string;
};

export const MEGASWING_OBJECTS: MegaSwingObject[] = [
	{
		id: 'yukio',
		kind: 'character',
		title: '유기오',
		glyph: '유',
		meta: '주인공 · POV 9회 · 12 Scene',
		summary: '세계의 구조를 이해하려 하지만 타인의 감각에 직접 접근할 수 없다는 결핍을 가진 중심 인물.',
		identity: [
			{ label: '욕망', value: '세계의 구조를 이해한다' },
			{ label: '결핍', value: '타인의 감각에 직접 접근할 수 없다' },
			{ label: '두려움', value: '자신의 인식 자체가 오류일 가능성' },
			{ label: '역할', value: '주인공 / 관찰자 / 질문자' },
		],
		scenes: [
			{ id: 'scene-01', order: '01', title: '호텔의 진동', role: '감각의 최초 이상' },
			{ id: 'scene-03', order: '03', title: '야마노테선', role: '집단 리듬과 개인 감각' },
			{ id: 'scene-07', order: '07', title: '지하 통로', role: '진동의 변형' },
			{ id: 'scene-10', order: '10', title: '병실 손잡이', role: '기억 촉발' },
			{ id: 'scene-11', order: '11', title: '폐쇄 승강장', role: '부분 회수' },
			{ id: 'scene-12', order: '12', title: '다시 05:40', role: '구조 회수' },
		],
		situations: [ '진동 감지 · 4', '기억 충돌 · 3', '시간 교란 · 2', '윤리 대화 · 2', '부분 회수 · 1' ],
		themes: [
			{ label: '고통', value: 7, max: 8 },
			{ label: '인식', value: 6, max: 8 },
			{ label: '존재', value: 4, max: 8 },
			{ label: '미래', value: 2, max: 8 },
		],
		knowledge: [
			{ label: '진동은 단발 현상이 아니다', known: true },
			{ label: '문손잡이가 기억을 촉발한다', known: true },
			{ label: '붉은 우산의 실제 소유자', known: false },
			{ label: '미래인의 정체', known: false },
		],
		qa: [
			{ question: 'Q1 · 고통은 존재하는가', answer: '모른다. 하지만 어떤 것에 대한 인간 특유의 반응으로서 그것이 존재한다는 사실 자체는 자각 가능하다.' },
			{ question: 'Q3 · 고통은 줄여야 하는가', answer: '줄여야 한다. 고통이 초조와 불안을 만들고 자신이 목적하는 바를 안정감 있게 추구하지 못하게 하기 때문이다.' },
		],
		motifs: [
			{ label: '철도 진동', steps: [ { label: '설치', state: 'on' }, { label: '반복', state: 'on' }, { label: '변형', state: 'on' }, { label: '오인', state: 'off' }, { label: '회수', state: 'on' } ] },
			{ label: '문손잡이', steps: [ { label: '설치', state: 'on' }, { label: '반복', state: 'on' }, { label: '변형', state: 'off' }, { label: '오인', state: 'off' }, { label: '회수', state: 'on' } ] },
		],
		relations: [ '최오윤 · 대립적 해석', '미즈키 · 기억의 연결점', '미래인 · 인식의 불확실성', '강아지 보리 · 비인간 관점' ],
		locations: [ '철도 전망 호텔', '야마노테선', '지하 통로', '병원 복도', '폐쇄 승강장' ],
		symbols: [ '철도 진동', '종이컵', '문손잡이', '전광판', '백색광' ],
		manuscript: '열차 문이 닫힐 때마다 사람들의 몸이 같은 방향으로 기울었다. 유기오는 손잡이를 쥔 채 전광판을 보았다. 초 단위가 바뀌는 순간 호텔의 종이컵에 생겼던 동심원이 떠올랐다…',
	},
	{
		id: 'oyun',
		kind: 'character',
		title: '최오윤',
		glyph: '최',
		meta: '대립축 · POV 6회 · 9 Scene',
		summary: '고통과 세계를 주어진 것으로 받아들이는 실용적 대립축. 유기오의 형이상학적 질문을 현실 경험으로 반박한다.',
		identity: [
			{ label: '욕망', value: '유희와 일상의 지속' },
			{ label: '태도', value: '해결 불가능한 것은 주어진 것으로 수용' },
			{ label: '역할', value: '유기오의 사유를 현실로 끌어내리는 대립축' },
		],
		scenes: [
			{ id: 'scene-04', order: '04', title: '병원 복도' },
			{ id: 'scene-08', order: '08', title: '호텔 로비의 거짓말' },
			{ id: 'scene-10', order: '10', title: '병실 손잡이' },
	],
		situations: [ '병실 회피 · 2', '윤리 대화 · 3', '기억 충돌 · 2' ],
		themes: [ { label: '고통', value: 6, max: 8 }, { label: '생존권리', value: 5, max: 8 }, { label: '미래', value: 4, max: 8 } ],
		knowledge: [ { label: '진동은 반복된다', known: true }, { label: '유기오의 전체 기억', known: false } ],
		qa: [
			{ question: 'Q1 · 고통은 존재하는가', answer: '타인의 고통은 잘 모르겠으나 자신의 고통은 기분과 관련된 신체작용과 정신적 작용으로 존재한다고 본다.' },
			{ question: 'Q3 · 고통은 줄여야 하는가', answer: '줄이는 것이 좋다. 고통이 많다는 것은 자신이 원하는 대로 유희를 즐길 기회가 적다는 증거이기 때문이다.' },
		],
		motifs: [ { label: '문손잡이', steps: [ { label: '설치', state: 'on' }, { label: '반복', state: 'on' }, { label: '회수', state: 'on' } ] } ],
		relations: [ '유기오 · 철학적 대립', '미즈키 · 현실적 연대' ],
		locations: [ '병원 복도', '호텔 로비', '병실' ],
		symbols: [ '문손잡이', '백색광', '바흐 선율' ],
		manuscript: '최오윤은 손잡이가 차갑다는 사실 외에는 아무것도 확신하지 않으려 했다. 확신이 적을수록 오늘은 견딜 만했다…',
	},
	{
		id: 'scene-03',
		kind: 'scene',
		title: '03 야마노테선',
		glyph: '03',
		meta: '08:30 · POV 유기오 · 초고',
		summary: '집단 리듬과 개인 감각을 대비하면서 철도 진동을 반복하고 전광판 모티프를 설치하는 장면.',
		identity: [ { label: 'POV', value: '유기오' }, { label: '시간', value: '08:30' }, { label: '목적', value: '집단 리듬과 개인 감각의 대비' }, { label: '대칭', value: '30장' } ],
		scenes: [ { id: 'scene-01', order: '01', title: '호텔의 진동', role: '원인/설치' }, { id: 'scene-09', order: '09', title: '철도 건널목', role: '전광판 변형' } ],
		situations: [ '전철 이동', '진동 감지', '기억 촉발' ],
		themes: [ { label: '인식', value: 7, max: 8 }, { label: '고통', value: 4, max: 8 } ],
		knowledge: [ { label: '진동의 반복성 공개', known: true }, { label: '전광판의 의미', known: false } ],
		qa: [ { question: 'Q7 · 존재란 무엇인가', answer: '이 장면에서는 명시적 답변 대신 집단의 동일한 움직임과 개인의 다른 시간감각을 충돌시킨다.' } ],
		motifs: [ { label: '철도 진동', steps: [ { label: '01 설치', state: 'on' }, { label: '03 반복', state: 'on' }, { label: '07 변형', state: 'off' }, { label: '12 회수', state: 'off' } ] }, { label: '전광판', steps: [ { label: '03 설치', state: 'on' }, { label: '09 변형', state: 'off' } ] } ],
		relations: [ '유기오 · POV', '30장 · 대칭', 'Q7 · 질문', '철도 진동 · 반복' ],
		locations: [ '야마노테선' ],
		symbols: [ '손잡이', '전광판', '동심원 기억' ],
		manuscript: '열차 문이 닫힐 때마다 사람들의 몸이 같은 방향으로 기울었다. 사람들은 같은 방향으로 흔들렸지만, 같은 시간을 지나고 있는지는 알 수 없었다.',
	},
	{
		id: 'pain', kind: 'theme', title: '고통', glyph: '◇', meta: 'Theme · 18 Scene · 7 Answer',
		summary: '작품 전체의 중심 질문축. 신체적 감각, 인식, 윤리, 미래의 고통을 인물별로 충돌시킨다.',
		identity: [ { label: '핵심 질문', value: '고통은 존재하는가' }, { label: '반대축', value: '무관심 / 쾌 / 질서' }, { label: '해결', value: '완전 제거가 아닌 관점별 부분 답변' } ],
		scenes: [ { id: 'scene-01', order: '01', title: '호텔의 진동' }, { id: 'scene-04', order: '04', title: '병원 복도' }, { id: 'scene-10', order: '10', title: '병실 손잡이' } ],
		situations: [ '진동 감지', '병실 회피', '윤리 대화' ],
		themes: [ { label: '인식', value: 7, max: 8 }, { label: '존재', value: 6, max: 8 }, { label: '생존권리', value: 5, max: 8 } ],
		knowledge: [ { label: '인물마다 고통 정의가 다름', known: true } ],
		qa: [ { question: 'Q1 · 고통은 존재하는가', answer: '유기오·최오윤·보리의 Answer가 서로 다른 층위에서 충돌한다.' }, { question: 'Q3 · 고통은 줄여야 하는가', answer: '대체로 줄이는 방향에 동의하지만 이유는 서로 다르다.' } ],
		motifs: [ { label: '철도 진동', steps: [ { label: '감각', state: 'on' }, { label: '반복', state: 'on' }, { label: '회수', state: 'on' } ] } ],
		relations: [ '유기오', '최오윤', '보리', 'Q1', 'Q3' ], locations: [ '호텔', '병원', '철도' ], symbols: [ '진동', '차가운 피부', '백색광' ],
		manuscript: '고통은 하나의 정의가 아니라 장면과 인물마다 다른 감각·판단·윤리의 층위로 반복된다.',
	},
	{
		id: 'vibration', kind: 'motif', title: '철도 진동', glyph: '≈', meta: '설치 → 반복 → 변형 → 회수',
		summary: '공간의 물리적 진동이 기억과 관념으로 침투하는 핵심 모티프.',
		identity: [ { label: '의미', value: '외부 공간이 내부 인식으로 침투하는 현상' }, { label: '수명주기', value: '01 설치 → 03 반복 → 07 변형 → 12 회수' } ],
		scenes: [ { id: 'scene-01', order: '01', title: '호텔의 진동', role: '설치' }, { id: 'scene-03', order: '03', title: '야마노테선', role: '반복' }, { id: 'scene-07', order: '07', title: '지하 통로', role: '변형' }, { id: 'scene-12', order: '12', title: '다시 05:40', role: '회수' } ],
		situations: [ '진동 감지', '기억 충돌' ], themes: [ { label: '인식', value: 8, max: 8 }, { label: '고통', value: 6, max: 8 } ], knowledge: [], qa: [],
		motifs: [ { label: '철도 진동', steps: [ { label: '01 설치', state: 'on' }, { label: '03 반복', state: 'on' }, { label: '07 변형', state: 'on' }, { label: '12 회수', state: 'on' } ] } ],
		relations: [ '유기오', '호텔', '야마노테선', 'Q7' ], locations: [ '철도 전망 호텔', '야마노테선', '지하 통로' ], symbols: [ '동심원', '손잡이', '진동음' ],
		manuscript: '컵의 물은 먼저 흔들렸고, 그다음에는 손목이, 마지막에는 기억의 문장이 흔들렸다.',
	},
	{
		id: 'q1', kind: 'question', title: 'Q1 고통은 존재하는가', glyph: '?', meta: 'Question · Answer 3',
		summary: '동일한 질문을 여러 인물에게 던져 세계관의 차이를 드러내는 Question Object.',
		identity: [ { label: 'Theme', value: '고통' }, { label: '축', value: '존재 / 인식' } ], scenes: [], situations: [], themes: [ { label: '고통', value: 8, max: 8 }, { label: '존재', value: 7, max: 8 } ], knowledge: [],
		qa: [ { question: '유기오', answer: '모른다. 하지만 인간 특유의 반응으로서 존재한다는 사실 자체는 자각 가능하다.' }, { question: '최오윤', answer: '타인의 고통은 잘 모르겠으나 자신의 고통은 신체작용과 정신적 작용으로 존재한다.' }, { question: '강아지 보리', answer: '방금은 있었는데 지금은 없다. 그리고 질문이 무엇인지 까먹었다.' } ], motifs: [],
		relations: [ '유기오', '최오윤', '강아지 보리', 'Theme 고통' ], locations: [], symbols: [], manuscript: '하나의 질문에 세 개의 서로 다른 존재론적 반응이 연결된다.',
	},
	{
		id: 'fact-03', kind: 'fact', title: 'Fact 03 · 진동은 반복된다', glyph: '◆', meta: 'Known by 유기오 · 최오윤',
		summary: '철도/호텔 진동이 우연한 단발 사건이 아니라 반복되는 구조라는 사실.',
		identity: [ { label: 'Known by', value: '유기오, 최오윤' }, { label: 'Reveal', value: 'Scene 03' } ],
		scenes: [ { id: 'scene-03', order: '03', title: '야마노테선', role: '공개' }, { id: 'scene-07', order: '07', title: '지하 통로', role: '재확인' } ], situations: [ '진동 감지' ], themes: [ { label: '인식', value: 7, max: 8 } ],
		knowledge: [ { label: '유기오', known: true }, { label: '최오윤', known: true }, { label: '미즈키', known: false } ], qa: [], motifs: [ { label: '철도 진동', steps: [ { label: '03 공개', state: 'on' }, { label: '07 확인', state: 'on' } ] } ],
		relations: [ '유기오', '최오윤', '철도 진동' ], locations: [ '야마노테선', '지하 통로' ], symbols: [ '동심원' ], manuscript: '그는 두 번째 진동에서야 첫 번째가 우연이 아니었다는 것을 알았다.',
	},
];

export const getMegaSwingObject = ( id: string ): MegaSwingObject =>
	MEGASWING_OBJECTS.find( ( object ) => object.id === id ) ?? MEGASWING_OBJECTS[ 0 ];
