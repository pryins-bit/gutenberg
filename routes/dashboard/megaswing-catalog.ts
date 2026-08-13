import type { MegaSwingResolvedObject, MegaSwingUniversalKind } from './megaswing-universal';

const makeObject = (
	id: string,
	kind: MegaSwingUniversalKind,
	title: string,
	glyph: string,
	summary: string,
	overrides: Partial<MegaSwingResolvedObject> = {}
): MegaSwingResolvedObject => ( {
	id,
	kind,
	title,
	glyph,
	meta: `${ kind } · 철도 전망 호텔`,
	summary,
	identity: [],
	scenes: [],
	situations: [],
	themes: [],
	knowledge: [],
	qa: [],
	motifs: [],
	relations: [],
	locations: [],
	symbols: [],
	manuscript: '',
	...overrides,
} );

const extraCharacters: MegaSwingResolvedObject[] = [
	makeObject( 'char-bori', 'character', '강아지 보리', '보', '현재의 감각과 쾌에 즉각 반응하고 질문 자체를 쉽게 잊는 비인간 관점.', {
		meta: 'Character · 비인간 POV',
		qa: [ { question: 'Q1 · 고통은 존재하는가', answer: '방금은 있었는데 지금은 없다. 그리고 질문이 무엇인지 까먹었다.' } ],
		relations: [ 'Q1 고통은 존재하는가', '고통' ],
		symbols: [ '간식', '산책', '현재 감각' ],
	} ),
	makeObject( 'char-future-person', 'character', '미래인', '未', '미래의 질서와 현재의 고통을 연결하는 시간축의 인물.', { relations: [ '미래', '영원', '강변' ] } ),
	makeObject( 'char-eternal-shincheonji', 'character', '영원의 신천지', '永', '영원이라는 약속과 종교적 질서를 극단적으로 밀어붙이는 집단/인물 객체.', { relations: [ '영원', '사이비', '코스모스' ] } ),
	makeObject( 'char-baby', 'character', '아기', '아', '언어 이전의 감각과 생존권리를 드러내는 인물 객체.', { relations: [ '생존권리', '고통', 'abortion' ] } ),
	makeObject( 'char-mizuki', 'character', '미즈키', '미', '기억과 오인, 붉은 우산의 반복을 통해 장면들을 연결하는 인물.', { relations: [ '붉은 우산', '기억 충돌', '유기오' ], symbols: [ '붉은 우산', '젖은 종이' ] } ),
	makeObject( 'char-cult', 'character', '사이비', '僞', '설교와 해결 약속을 통해 고통의 단순한 해답을 제시하는 대립 객체.', { relations: [ '사이비 설교', '해결', '영원의 신천지' ] } ),
	makeObject( 'char-grandmother', 'character', '외할머니', '祖', '세대 기억과 오래된 생활 감각을 현재의 사건과 연결하는 인물.', { relations: [ '기억 충돌', '영원', '도시' ] } ),
	makeObject( 'char-city', 'character', '도시', '都', '배경이 아니라 압력·리듬·소음·동선을 생산하는 집합적 인물 객체.', { relations: [ '도시 과부하', '카오스', '코스모스', '철도 진동' ], symbols: [ '전광판', '백색광', '층간소음' ] } ),
];

const extraThemes: MegaSwingResolvedObject[] = [
	makeObject( 'theme-abortion', 'theme', 'abortion', 'A', '생존권리, 선택, 미래 가능성을 충돌시키는 주제 축.' ),
	makeObject( 'theme-future', 'theme', '미래', '未', '현재의 선택이 아직 존재하지 않는 사람에게 어떤 의미를 갖는지 묻는 축.' ),
	makeObject( 'theme-survival-right', 'theme', '생존권리', '生', '존재가 지속될 권리와 타인의 선택권을 충돌시키는 축.' ),
	makeObject( 'theme-eternity', 'theme', '영원', '∞', '소멸을 부정하려는 욕망과 반복되는 질서를 다루는 축.' ),
	makeObject( 'theme-existence', 'theme', '존재', '存', '감각·인식·기억이 존재의 조건인지 묻는 축.' ),
	makeObject( 'theme-perception', 'theme', '인식', '眼', '외부 세계와 내부 해석 사이의 오차를 다루는 축.' ),
	makeObject( 'theme-solution', 'theme', '해결', '解', '고통을 제거·수용·전환하는 서로 다른 해법을 비교하는 축.' ),
	makeObject( 'theme-chaos', 'theme', '카오스', '乱', '과잉 정보와 충돌하는 감각이 만들어내는 무질서의 축.' ),
	makeObject( 'theme-cosmos', 'theme', '코스모스', '秩', '바흐의 선율처럼 질서를 구성하려는 힘을 다루는 축.' ),
];

const materials = [
	[ 'material-red-umbrella', '붉은 우산', '☂', '오인과 기억을 연결하는 반복 사물.' ],
	[ 'material-paper-cup', '종이컵', '杯', '진동을 눈으로 보이게 만드는 작은 감각 장치.' ],
	[ 'material-door-handle', '문손잡이', '門', '차가운 촉감이 기억을 촉발하는 사물.' ],
	[ 'material-display', '전광판', '▤', '시간과 이동 경로를 숫자로 고정하는 도시 장치.' ],
	[ 'material-bach', '바흐 선율', '♫', '카오스에 맞서는 질서의 청각적 모티프.' ],
	[ 'material-floor-noise', '층간소음', '≋', '공간을 넘어 침투하는 비가시적 압력.' ],
	[ 'material-cold-skin', '차가운 피부', '冷', '생명과 사물의 경계를 흔드는 촉각 이미지.' ],
	[ 'material-wet-paper', '젖은 종이', '紙', '기억과 기록이 훼손되는 상태를 나타내는 사물.' ],
	[ 'material-white-light', '백색광', '□', '병원과 도시의 비인격적 질서를 만드는 빛.' ],
].map( ( [ id, title, glyph, summary ] ) => makeObject( id, 'material', title, glyph, summary ) );

const locations = [
	'철도 전망 호텔', '호텔 로비', '병원 복도', '야마노테선', '철도 건널목',
	'지하 통로', '강변', '서점', '아파트', '폐쇄 승강장',
].map( ( title, index ) => makeObject( `location-${ index + 1 }`, 'location', title, '⌖', `${ title }에서 발생하는 장면·인물·모티프를 모아보는 공간 객체.` ) );

const times = [ '05:40', '07:10', '08:30', '10:00', '11:45', '13:00', '15:20', '17:30', '22:00', '02:30' ]
	.map( ( title, index ) => makeObject( `time-${ index + 1 }`, 'time', title, '⌚', `${ title }에 연결된 사건과 원고 순서를 비교하는 시간 객체.` ) );

const situations = [
	'진동 감지', '우산 오인', '병실 회피', '기억 충돌', '미래 기억',
	'윤리 대화', '동물 시점', '사이비 설교', '도시 과부하', '부분 회수',
].map( ( title, index ) => makeObject( `situation-${ index + 1 }`, 'situation', title, '!', `${ title }가 발생한 Scene과 관여한 Character를 모아보는 상황 객체.` ) );

const techniques = [
	'의식의 흐름', '자유간접화법', '반복 모티프', '1-12-1 대칭', '23문장 아치',
	'도시 몽타주', '다중 시점', '시간 교란', '감각 전이', '논리 반박',
].map( ( title, index ) => makeObject( `technique-${ index + 1 }`, 'technique', title, '✎', `${ title } 기법이 사용된 Scene과 문장 예시를 모아보는 기법 객체.` ) );

const answers: MegaSwingResolvedObject[] = [
	makeObject( 'answer-q1-yukio', 'answer', 'Q1 × 유기오 Answer', '答', '질문과 인물을 잇는 canonical Answer 객체.', {
		meta: 'Answer · 유기오 × Q1 × 고통',
		qa: [ { question: '고통은 존재하는가', answer: '모른다. 하지만 어떤 것에 대한 인간 특유의 반응으로서 그것이 존재한다는 사실 자체는 자각 가능하다.' } ],
		relations: [ '유기오', 'Q1 고통은 존재하는가', '고통' ],
	} ),
	makeObject( 'answer-q1-oyun', 'answer', 'Q1 × 최오윤 Answer', '答', '질문과 인물을 잇는 canonical Answer 객체.', {
		meta: 'Answer · 최오윤 × Q1 × 고통',
		qa: [ { question: '고통은 존재하는가', answer: '타인의 고통은 잘 모르겠으나 자신의 고통은 기분과 관련된 신체작용과 정신적 작용으로 존재한다고 본다.' } ],
		relations: [ '최오윤', 'Q1 고통은 존재하는가', '고통' ],
	} ),
	makeObject( 'answer-q1-bori', 'answer', 'Q1 × 보리 Answer', '答', '질문과 비인간 인물을 잇는 canonical Answer 객체.', {
		meta: 'Answer · 강아지 보리 × Q1 × 고통',
		qa: [ { question: '고통은 존재하는가', answer: '방금은 있었는데 지금은 없다. 그리고 질문이 무엇인지 까먹었다.' } ],
		relations: [ '강아지 보리', 'Q1 고통은 존재하는가', '고통' ],
	} ),
];

const project = makeObject( 'project-rail-hotel', 'project', '철도 전망 호텔', '▣', '소설 전체의 Character·Scene·Theme·Question·Fact·Motif를 묶는 최상위 Project 객체.', {
	meta: 'Project · MegaSwing 360',
	relations: [ '유기오', '최오윤', '고통', '철도 진동', 'Q1 고통은 존재하는가' ],
	locations: [ '철도 전망 호텔', '야마노테선', '병원 복도', '폐쇄 승강장' ],
	symbols: [ '철도 진동', '붉은 우산', '문손잡이', '전광판' ],
} );

export const MEGASWING_EXTRA_OBJECTS: MegaSwingResolvedObject[] = [
	project,
	...extraCharacters,
	...extraThemes,
	...materials,
	...locations,
	...times,
	...situations,
	...techniques,
	...answers,
];
