import type { MegaSwingResolvedObject } from './megaswing-universal';

const question = (
	index: number,
	title: string,
	theme: string,
	axis: string
): MegaSwingResolvedObject => ( {
	id: `question-${ index }`,
	kind: 'question',
	title: `Q${ index } ${ title }`,
	glyph: '?',
	meta: `Question · ${ theme }`,
	summary: title,
	identity: [ { label: '주제', value: theme }, { label: '대립축', value: axis } ],
	scenes: [], situations: [], themes: [ { label: theme, value: 8, max: 8 } ], knowledge: [], qa: [], motifs: [],
	relations: [ theme ], locations: [], symbols: [], manuscript: '',
} );

const answer = (
	id: string,
	character: string,
	questionTitle: string,
	theme: string,
	text: string
): MegaSwingResolvedObject => ( {
	id,
	kind: 'answer',
	title: `${ questionTitle.split( ' ' )[ 0 ] } × ${ character } Answer`,
	glyph: '答',
	meta: `Answer · ${ character } × ${ theme }`,
	summary: '질문과 인물 사이의 canonical Answer. 이 문서 하나를 수정하면 Character / Question / Theme / Matrix가 같은 답을 봅니다.',
	identity: [
		{ label: '인물', value: character },
		{ label: '질문', value: questionTitle },
		{ label: '주제', value: theme },
	],
	scenes: [], situations: [], themes: [ { label: theme, value: 8, max: 8 } ], knowledge: [],
	qa: [ { question: questionTitle, answer: text } ], motifs: [],
	relations: [ character, questionTitle, theme ], locations: [], symbols: [], manuscript: text,
} );

export const MEGASWING_QUESTIONS: MegaSwingResolvedObject[] = [
	// Q1 richer canonical object already exists in megaswing-data.ts.
	question( 2, '고통은 왜 생기는가', '고통', '원인 / 구조' ),
	question( 3, '고통은 줄여야 하는가', '고통', '감소 / 수용' ),
	question( 4, '해결방법은 무엇인가', '해결', '개인 / 구조' ),
	question( 5, '문제의 출발은 어디인가', '카오스', '원인 / 결과' ),
	question( 6, '동물도 고통을 느끼는가', '존재', '인간 / 비인간' ),
	question( 7, '존재란 무엇인가', '존재', '객관 / 인식' ),
	question( 8, '고통이란 무엇인가', '인식', '감각 / 개념' ),
	question( 9, '타인의 고통에 윤리적 의무가 있는가', '생존권리', '자기 / 타인' ),
	question( 10, '미래 사람들도 같은 고통을 느끼는가', '미래', '현재 / 미래' ),
];

export const MEGASWING_CANONICAL_ANSWERS: MegaSwingResolvedObject[] = [
	// Q1 three answers already exist in base/catalog.
	answer( 'answer-q2-yukio', '유기오', 'Q2 고통은 왜 생기는가', '고통', '수반되는 세계 구조의 일부분이다.' ),
	answer( 'answer-q2-oyun', '최오윤', 'Q2 고통은 왜 생기는가', '고통', '본질을 알 시간은 부족하고, 안다고 해도 제거가 불가능한 것을 경험으로 알고 있다. 주어진 것으로 받아들인다.' ),
	answer( 'answer-q3-yukio', '유기오', 'Q3 고통은 줄여야 하는가', '고통', '줄여야 한다. 고통이 초조와 불안을 만들고 자신이 목적하는 바를 안정감 있게 추구하지 못하게 하기 때문이다.' ),
	answer( 'answer-q3-oyun', '최오윤', 'Q3 고통은 줄여야 하는가', '고통', '줄이는 것이 좋다. 고통이 많다는 것은 자신이 원하는 대로 유희를 즐길 기회가 적다는 증거이기 때문이다.' ),
	answer( 'answer-q3-bori', '강아지 보리', 'Q3 고통은 줄여야 하는가', '고통', '줄이는 게 좋긴 하지만 관심이 없고 간식이나 쾌를 바란다.' ),
	answer( 'answer-q4-yukio', '유기오', 'Q4 해결방법은 무엇인가', '해결', '당사자에게 가장 특수하여 남들이 완전히 도와주기 어렵다. 진동은 공간적 현상으로 마음과 관념까지 침투한다.' ),
	answer( 'answer-q4-oyun', '최오윤', 'Q4 해결방법은 무엇인가', '해결', '기부나 운동으로 모두 제거할 수 있다는 생각은 하지 않는다. 미래에는 필요 최소의 고통만 남을 것이라고 본다.' ),
	answer( 'answer-q4-bori', '강아지 보리', 'Q4 해결방법은 무엇인가', '해결', '더 많은 간식과 많은 산책.' ),
	answer( 'answer-q6-yukio', '유기오', 'Q6 동물도 고통을 느끼는가', '존재', '모른다. 데카르트나 기독교적 영혼 관점에서 동물을 배제하는 말에 슬픔을 느낀다.' ),
	answer( 'answer-q6-oyun', '최오윤', 'Q6 동물도 고통을 느끼는가', '존재', '고양이는 그런 것에 무심하고 잘 잊어버리는 것처럼 보인다.' ),
	answer( 'answer-q8-yukio', '유기오', 'Q8 고통이란 무엇인가', '인식', '인간 감각에 수반되는 인식적 작용이며 세계를 알아가는 데 필요하다.' ),
	answer( 'answer-q10-oyun', '최오윤', 'Q10 미래 사람들도 같은 고통을 느끼는가', '미래', '미래에는 근심과 고통이 사라지고 바흐의 음악 같은 질서가 남겠지만 그것 역시 인간 의식의 범주일 뿐이다.' ),
];
