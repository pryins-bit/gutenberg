import type { MegaSwingResolvedObject } from './megaswing-universal';

const scene = (
	order: string,
	title: string,
	summary: string,
	overrides: Partial<MegaSwingResolvedObject> = {}
): MegaSwingResolvedObject => ( {
	id: `scene-${ order }`,
	kind: 'scene',
	title: `${ order } ${ title }`,
	glyph: order,
	meta: `Scene ${ order } · 철도 전망 호텔`,
	summary,
	identity: [ { label: '순서', value: order } ],
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

// Scene 03 is already the richer canonical sample in megaswing-data.ts.
export const MEGASWING_EXTRA_SCENES: MegaSwingResolvedObject[] = [
	scene( '01', '호텔의 진동', '호텔에서 감지한 진동이 작품의 감각적·인식적 문제를 처음 설치한다.', {
		identity: [ { label: '순서', value: '01' }, { label: '시간', value: '05:40' } ],
		situations: [ '진동 감지' ],
		relations: [ '유기오', '철도 진동', '종이컵', '고통', '인식' ],
		locations: [ '철도 전망 호텔' ],
		symbols: [ '철도 진동', '종이컵' ],
	} ),
	scene( '02', '붉은 우산', '붉은 우산을 둘러싼 오인이 기억과 인물 관계의 첫 흔들림을 만든다.', {
		situations: [ '우산 오인' ],
		relations: [ '미즈키', '붉은 우산', '기억 충돌' ],
		locations: [ '호텔 로비' ],
		symbols: [ '붉은 우산', '바흐 선율' ],
	} ),
	scene( '04', '병원 복도', '병원 복도의 백색광과 차가운 손잡이가 고통을 물리적 감각으로 압축한다.', {
		situations: [ '병실 회피' ],
		relations: [ '최오윤', '문손잡이', '고통' ],
		locations: [ '병원 복도' ],
		symbols: [ '문손잡이', '백색광', '차가운 피부' ],
	} ),
	scene( '05', '서점의 기억', '기록과 기억이 일치하지 않는 순간을 젖은 종이와 서점 공간으로 드러낸다.', {
		situations: [ '기억 충돌' ],
		relations: [ '미즈키', '젖은 종이', '인식' ],
		locations: [ '서점' ],
		symbols: [ '젖은 종이' ],
	} ),
	scene( '06', '강변의 미래인', '미래인이 등장해 현재의 선택과 미래 사람의 고통을 한 시간축에 놓는다.', {
		situations: [ '미래 기억', '윤리 대화' ],
		relations: [ '미래인', '미래', '생존권리' ],
		locations: [ '강변' ],
	} ),
	scene( '07', '지하 통로', '철도 진동이 공간적 현상에서 기억과 관념의 흔들림으로 변형된다.', {
		situations: [ '진동 감지', '동물 시점' ],
		relations: [ '유기오', '강아지 보리', '철도 진동', '인식' ],
		locations: [ '지하 통로' ],
		symbols: [ '철도 진동', '층간소음' ],
	} ),
	scene( '08', '호텔 로비의 거짓말', '이전에 설치된 붉은 우산과 인물의 말이 충돌하며 오인의 의미를 키운다.', {
		situations: [ '우산 오인', '기억 충돌' ],
		relations: [ '최오윤', '미즈키', '붉은 우산' ],
		locations: [ '호텔 로비' ],
		symbols: [ '붉은 우산', '바흐 선율' ],
	} ),
	scene( '09', '철도 건널목', '전광판과 철도 이미지가 처음의 이동 의미를 다른 방향으로 변형한다.', {
		situations: [ '도시 과부하' ],
		relations: [ '03 야마노테선', '전광판', '도시', '카오스' ],
		locations: [ '철도 건널목' ],
		symbols: [ '전광판', '철도 진동' ],
	} ),
	scene( '10', '병실 손잡이', '문손잡이의 반복이 기억을 다시 호출하고 병실 회피를 되돌려 놓는다.', {
		situations: [ '병실 회피', '기억 충돌' ],
		relations: [ '유기오', '최오윤', '문손잡이' ],
		locations: [ '병원 복도' ],
		symbols: [ '문손잡이', '차가운 피부' ],
	} ),
	scene( '11', '폐쇄 승강장', '붉은 우산과 철도 구조의 일부가 회수되지만 남은 질문을 의도적으로 보존한다.', {
		situations: [ '부분 회수' ],
		relations: [ '붉은 우산', '철도 진동', '해결' ],
		locations: [ '폐쇄 승강장' ],
		symbols: [ '붉은 우산', '백색광' ],
	} ),
	scene( '12', '다시 05:40', '첫 장면의 시간과 진동을 되돌려 대칭 구조를 닫으면서도 인식의 질문은 남긴다.', {
		identity: [ { label: '순서', value: '12' }, { label: '시간', value: '05:40' } ],
		situations: [ '부분 회수', '진동 감지' ],
		relations: [ '01 호텔의 진동', '유기오', '철도 진동', '인식', '코스모스' ],
		locations: [ '철도 전망 호텔' ],
		symbols: [ '철도 진동', '문손잡이' ],
	} ),
];
