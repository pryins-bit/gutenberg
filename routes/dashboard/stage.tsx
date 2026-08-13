import { Page } from '@wordpress/admin-ui';
import { useState } from '@wordpress/element';

type ObjectKind = 'character' | 'scene' | 'theme' | 'motif' | 'question' | 'fact';
type LayoutMode = 'cards' | 'magazine' | 'dense';
type BlockKey =
	| 'profile'
	| 'storyArc'
	| 'scenes'
	| 'situations'
	| 'themes'
	| 'qa'
	| 'knowledge'
	| 'motifs'
	| 'manuscript'
	| 'relationships'
	| 'timeline'
	| 'voice'
	| 'revision'
	| 'locations'
	| 'symbols';

type StoryObject = {
	id: string;
	kind: ObjectKind;
	title: string;
	meta: string;
	glyph: string;
};

const OBJECTS: StoryObject[] = [
	{ id: 'yukio', kind: 'character', title: '유기오', meta: '주인공 · POV 9회 · 12 Scene', glyph: '유' },
	{ id: 'oyun', kind: 'character', title: '최오윤', meta: '대립축 · POV 6회 · 9 Scene', glyph: '최' },
	{ id: 'scene-03', kind: 'scene', title: '03 야마노테선', meta: '08:30 · 유기오 · 초고', glyph: '03' },
	{ id: 'pain', kind: 'theme', title: '고통', meta: 'Theme · 18 Scene · 7 Answer', glyph: '◇' },
	{ id: 'vibration', kind: 'motif', title: '철도 진동', meta: '설치 → 반복 → 변형 → 회수', glyph: '≈' },
	{ id: 'q1', kind: 'question', title: 'Q1 고통은 존재하는가', meta: 'Question · Answer 3', glyph: '?' },
	{ id: 'fact-03', kind: 'fact', title: 'Fact 03 · 진동은 반복된다', meta: 'Known by 유기오 · 최오윤', glyph: '◆' },
];

const CORE_BLOCKS: BlockKey[] = [
	'profile',
	'storyArc',
	'scenes',
	'situations',
	'themes',
	'qa',
	'knowledge',
	'motifs',
	'manuscript',
];

const INSERTABLE_BLOCKS: Array<{ key: BlockKey; label: string; description: string; icon: string }> = [
	{ key: 'relationships', label: '관계 지도', description: '인물·Fact·Theme 연결', icon: '⌘' },
	{ key: 'timeline', label: '시간축', description: '원고 순서와 사건 시간 비교', icon: '≈' },
	{ key: 'voice', label: 'Voice Lab', description: 'POV 문장·대화·어휘 지문', icon: '◉' },
	{ key: 'revision', label: 'Revision', description: '인물 수정 단계와 남은 작업', icon: '↻' },
	{ key: 'locations', label: '장소', description: '인물이 거친 공간과 장면', icon: '⌖' },
	{ key: 'symbols', label: '상징', description: '사물·이미지·감각 반복', icon: '◇' },
];

const BLOCK_LABELS: Record<BlockKey, string> = {
	profile: 'PROFILE',
	storyArc: 'STORY ARC',
	scenes: 'SCENE CARDS',
	situations: 'SITUATIONS',
	themes: 'THEMES',
	qa: 'QUESTIONS / ANSWERS',
	knowledge: 'KNOWLEDGE',
	motifs: 'MOTIF FLOW',
	manuscript: 'RELATED MANUSCRIPT',
	relationships: 'RELATIONSHIP MAP',
	timeline: 'STORY TIME',
	voice: 'VOICE LAB',
	revision: 'REVISION',
	locations: 'LOCATIONS',
	symbols: 'SYMBOLS',
};

const css = `
.ms360{--ms-accent:#7c3aed;--ms-card:color-mix(in srgb,currentColor 4%,transparent);--ms-border:color-mix(in srgb,currentColor 15%,transparent);color:inherit;min-height:100%;}
.ms360 *{box-sizing:border-box}.ms360 button{font:inherit;color:inherit}.ms360__top{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--ms-border)}
.ms360__brand{font-weight:700;margin-right:auto}.ms360__crumb{font-size:12px;opacity:.62}.ms360__topBtn,.ms360__modeBtn,.ms360__add{border:1px solid var(--ms-border);background:transparent;border-radius:8px;padding:6px 9px;cursor:pointer}
.ms360__topBtn:hover,.ms360__modeBtn:hover,.ms360__add:hover{border-color:var(--ms-accent)}.ms360__layout{display:grid;grid-template-columns:190px minmax(0,1fr) 220px;min-height:720px}
.ms360__sidebar{padding:12px;border-right:1px solid var(--ms-border)}.ms360__inspector{padding:12px;border-left:1px solid var(--ms-border)}.ms360__navLabel{font-size:10px;letter-spacing:.08em;opacity:.5;margin:10px 8px 5px;text-transform:uppercase}
.ms360__nav{width:100%;text-align:left;border:0;background:transparent;border-radius:8px;padding:8px;cursor:pointer;display:flex;align-items:center;gap:8px}.ms360__nav:hover,.ms360__nav.is-active{background:color-mix(in srgb,var(--ms-accent) 12%,transparent)}
.ms360__navGlyph{width:26px;height:26px;border-radius:8px;background:var(--ms-card);display:grid;place-items:center;font-size:11px;flex:0 0 auto}.ms360__main{padding:14px;min-width:0}.ms360__hero{display:flex;align-items:center;gap:12px;border:1px solid var(--ms-border);border-radius:14px;padding:14px;margin-bottom:12px;background:var(--ms-card)}
.ms360__avatar{width:54px;height:54px;border-radius:50%;background:color-mix(in srgb,var(--ms-accent) 18%,transparent);color:var(--ms-accent);display:grid;place-items:center;font-weight:800;font-size:18px}.ms360__hero small{font-size:10px;opacity:.55;display:block}.ms360__hero h2{font-size:20px;margin:2px 0 3px}.ms360__heroMeta{font-size:12px;opacity:.65}.ms360__live{margin-left:auto;border:1px solid color-mix(in srgb,var(--ms-accent) 50%,transparent);color:var(--ms-accent);border-radius:999px;padding:4px 8px;font-size:10px;font-weight:700}
.ms360__workspace{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ms360__block{border:1px solid var(--ms-border);border-radius:12px;background:var(--ms-card);padding:11px;min-width:0}.ms360__block.is-wide{grid-column:1/-1}.ms360__blockHead{display:flex;align-items:center;gap:6px;margin-bottom:9px}.ms360__blockHead b{font-size:12px}.ms360__blockHead small{font-size:10px;opacity:.5}.ms360__blockTools{margin-left:auto;display:flex;gap:2px}.ms360__blockTools button{border:0;background:transparent;cursor:pointer;opacity:.55;padding:2px 4px}.ms360__blockTools button:hover{opacity:1;color:var(--ms-accent)}
.ms360__arc{display:flex;align-items:center;gap:4px;overflow:auto;padding-bottom:2px}.ms360__arcNode{min-width:72px;border:1px solid var(--ms-border);border-radius:8px;text-align:center;padding:7px;font-size:10px}.ms360__arcNode.is-current{border-color:var(--ms-accent);background:color-mix(in srgb,var(--ms-accent) 10%,transparent)}.ms360__arrow{opacity:.35}.ms360__sceneGrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}.ms360__scene{border:1px solid var(--ms-border);border-radius:8px;padding:8px 5px;text-align:center;background:transparent;cursor:pointer}.ms360__scene:hover,.ms360__scene.is-current{border-color:var(--ms-accent);background:color-mix(in srgb,var(--ms-accent) 10%,transparent)}.ms360__scene b{display:block}.ms360__scene span{font-size:10px;opacity:.55}.ms360__kv{display:grid;grid-template-columns:64px 1fr;gap:8px;margin:7px 0;font-size:12px}.ms360__kv span:first-child{opacity:.55}.ms360__chips{display:flex;gap:5px;flex-wrap:wrap}.ms360__chip{border:1px solid var(--ms-border);border-radius:999px;padding:4px 7px;font-size:10px}.ms360__chip.is-known{background:color-mix(in srgb,var(--ms-accent) 11%,transparent);border-color:color-mix(in srgb,var(--ms-accent) 35%,transparent)}
.ms360__bar{display:grid;grid-template-columns:50px 1fr 18px;align-items:center;gap:7px;margin:7px 0;font-size:10px}.ms360__track{height:8px;border-radius:999px;background:var(--ms-border);overflow:hidden}.ms360__fill{height:100%;background:var(--ms-accent);border-radius:inherit}.ms360__qa+ .ms360__qa{border-top:1px solid var(--ms-border);padding-top:8px;margin-top:8px}.ms360__qa b{font-size:11px}.ms360__qa p,.ms360__copy{font-size:11px;line-height:1.55;opacity:.68;margin:4px 0 0}.ms360__motif{display:grid;grid-template-columns:74px 1fr;gap:7px;align-items:center;margin:7px 0;font-size:10px}.ms360__steps{display:flex;gap:3px}.ms360__step{flex:1;border:1px solid var(--ms-border);border-radius:5px;padding:4px 2px;text-align:center;opacity:.5}.ms360__step.is-on{opacity:1;border-color:color-mix(in srgb,var(--ms-accent) 55%,transparent);background:color-mix(in srgb,var(--ms-accent) 10%,transparent)}
.ms360__add{width:100%;margin-top:10px;border-style:dashed;padding:10px;opacity:.7}.ms360__palette{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}.ms360__palette button{border:1px solid var(--ms-border);background:transparent;border-radius:9px;text-align:left;padding:9px;cursor:pointer}.ms360__palette button:hover{border-color:var(--ms-accent)}.ms360__palette b{display:block;font-size:11px}.ms360__palette span{font-size:10px;opacity:.55}.ms360__modeRow{display:flex;gap:4px}.ms360__modeBtn{flex:1;font-size:10px}.ms360__modeBtn.is-active{background:var(--ms-accent);color:white;border-color:var(--ms-accent)}.ms360__inspectTitle{font-size:11px;font-weight:700;margin:16px 0 7px}.ms360__inspectBox{border:1px solid var(--ms-border);border-radius:9px;padding:9px;margin-bottom:7px}.ms360__inspectBox small{font-size:9px;opacity:.5;display:block}.ms360__inspectBox b{font-size:11px}.ms360__hint{font-size:11px;line-height:1.6;opacity:.62}.ms360.is-magazine .ms360__workspace{display:block}.ms360.is-magazine .ms360__block{margin-bottom:10px}.ms360.is-dense .ms360__workspace{grid-template-columns:repeat(3,minmax(0,1fr))}.ms360.is-dense .ms360__block.is-wide{grid-column:span 2}.ms360.is-dense .ms360__sceneGrid{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:1000px){.ms360__layout{grid-template-columns:160px minmax(0,1fr)}.ms360__inspector{display:none}.ms360__sceneGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:720px){.ms360__layout{display:block}.ms360__sidebar{display:none}.ms360__workspace,.ms360.is-dense .ms360__workspace{grid-template-columns:1fr}.ms360__block.is-wide,.ms360.is-dense .ms360__block.is-wide{grid-column:auto}.ms360__crumb{display:none}}
`;

function BlockBody( { block }: { block: BlockKey } ) {
	switch ( block ) {
		case 'profile':
			return (
				<>
					<div className="ms360__kv"><span>욕망</span><b>세계의 구조를 이해한다</b></div>
					<div className="ms360__kv"><span>결핍</span><b>타인의 감각에 직접 접근할 수 없다</b></div>
					<div className="ms360__kv"><span>두려움</span><b>자신의 인식 자체가 오류일 가능성</b></div>
				</>
			);
		case 'storyArc':
			return <div className="ms360__arc">{ [ '01 호텔', '03 야마노테', '07 지하통로', '10 병실', '11 승강장', '12 05:40' ].map( ( scene, index ) => <div key={ scene } style={ { display: 'contents' } }>{ index > 0 && <span className="ms360__arrow">→</span> }<div className={ `ms360__arcNode ${ index === 1 ? 'is-current' : '' }` }>{ scene }</div></div> ) }</div>;
		case 'scenes':
			return <div className="ms360__sceneGrid">{ [ '01 호텔의 진동', '02 붉은 우산', '03 야마노테선', '07 지하 통로', '10 병실 손잡이', '12 다시 05:40' ].map( ( scene ) => { const [ no, ...rest ] = scene.split( ' ' ); return <button type="button" key={ scene } className={ `ms360__scene ${ no === '03' ? 'is-current' : '' }` }><b>{ no }</b><span>{ rest.join( ' ' ) }</span></button>; } ) }</div>;
		case 'situations':
			return <div className="ms360__chips"><span className="ms360__chip">진동 감지 · 4</span><span className="ms360__chip">기억 충돌 · 3</span><span className="ms360__chip">시간 교란 · 2</span><span className="ms360__chip">윤리 대화 · 2</span><span className="ms360__chip">부분 회수 · 1</span></div>;
		case 'themes':
			return <>{ [ [ '고통', 88, 7 ], [ '인식', 75, 6 ], [ '존재', 50, 4 ], [ '미래', 25, 2 ] ].map( ( [ label, width, count ] ) => <div className="ms360__bar" key={ label }><span>{ label }</span><div className="ms360__track"><div className="ms360__fill" style={ { width: `${ width }%` } } /></div><b>{ count }</b></div> ) }</>;
		case 'qa':
			return <><div className="ms360__qa"><b>Q1 · 고통은 존재하는가</b><p>모른다. 하지만 인간 특유의 반응으로서 그것이 존재한다는 사실 자체는 자각 가능하다.</p></div><div className="ms360__qa"><b>Q3 · 고통은 줄여야 하는가</b><p>줄여야 한다. 고통이 초조와 불안을 만들고 목적을 안정감 있게 추구하지 못하게 하기 때문이다.</p></div></>;
		case 'knowledge':
			return <div className="ms360__chips"><span className="ms360__chip is-known">◆ 진동은 반복된다</span><span className="ms360__chip is-known">◆ 문손잡이가 기억을 촉발한다</span><span className="ms360__chip">◇ 우산 소유자는 모름</span><span className="ms360__chip">◇ 미래인의 정체 모름</span></div>;
		case 'motifs':
			return <>{ [ [ '철도 진동', [ 1, 1, 1, 0, 1 ] ], [ '문손잡이', [ 1, 1, 0, 0, 1 ] ] ].map( ( [ label, states ] ) => <div className="ms360__motif" key={ String( label ) }><b>{ label }</b><div className="ms360__steps">{ [ '설치', '반복', '변형', '오인', '회수' ].map( ( step, index ) => <span key={ step } className={ `ms360__step ${ ( states as number[] )[ index ] ? 'is-on' : '' }` }>{ step }</span> ) }</div></div> ) }</>;
		case 'manuscript':
			return <><p className="ms360__copy">열차 문이 닫힐 때마다 사람들의 몸이 같은 방향으로 기울었다. 유기오는 손잡이를 쥔 채 전광판을 보았다. 초 단위가 바뀌는 순간 호텔의 종이컵에 생겼던 동심원이 떠올랐다…</p><div className="ms360__chips" style={ { marginTop: 8 } }><span className="ms360__chip is-known">03 원고 열기</span><span className="ms360__chip">유기오 원고만 이어보기</span></div></>;
		case 'relationships':
			return <div className="ms360__chips"><span className="ms360__chip is-known">유기오</span><span className="ms360__chip">미즈키 · 강한 연결</span><span className="ms360__chip">최오윤 · 대립</span><span className="ms360__chip">미래인 · 미확정</span><span className="ms360__chip">철도 진동 · 반복</span><span className="ms360__chip">고통 · 핵심 주제</span></div>;
		case 'timeline':
			return <div className="ms360__arc">{ [ '05:40 호텔', '07:10 우산', '08:30 야마노테', '10:00 병원', '17:30 강변', '02:30 승강장' ].map( ( item, index ) => <div key={ item } style={ { display: 'contents' } }>{ index > 0 && <span className="ms360__arrow">→</span> }<div className="ms360__arcNode">{ item }</div></div> ) }</div>;
		case 'voice':
			return <><div className="ms360__kv"><span>평균 문장</span><b>38자</b></div><div className="ms360__kv"><span>질문문</span><b>8%</b></div><div className="ms360__kv"><span>대화 비율</span><b>14%</b></div><div className="ms360__kv"><span>반복어</span><b>감각 · 구조 · 진동 · 시간</b></div></>;
		case 'revision':
			return <div className="ms360__chips"><span className="ms360__chip is-known">✓ 구조</span><span className="ms360__chip is-known">✓ 인물</span><span className="ms360__chip">주제·복선</span><span className="ms360__chip">문장</span><span className="ms360__chip">교정</span><span className="ms360__chip">제출</span></div>;
		case 'locations':
			return <div className="ms360__chips"><span className="ms360__chip">철도 전망 호텔 · 4</span><span className="ms360__chip">야마노테선 · 1</span><span className="ms360__chip">지하 통로 · 2</span><span className="ms360__chip">병원 복도 · 2</span><span className="ms360__chip">폐쇄 승강장 · 1</span></div>;
		case 'symbols':
			return <div className="ms360__chips"><span className="ms360__chip is-known">철도 진동 · 6</span><span className="ms360__chip">문손잡이 · 3</span><span className="ms360__chip">종이컵 · 2</span><span className="ms360__chip">전광판 · 2</span><span className="ms360__chip">백색광 · 2</span></div>;
	}
}

function MegaSwingDashboard() {
	const [ selectedId, setSelectedId ] = useState( 'yukio' );
	const [ layoutMode, setLayoutMode ] = useState<LayoutMode>( 'cards' );
	const [ blocks, setBlocks ] = useState<BlockKey[]>( CORE_BLOCKS );
	const [ inserterOpen, setInserterOpen ] = useState( false );
	const selected = OBJECTS.find( ( item ) => item.id === selectedId ) ?? OBJECTS[ 0 ];

	const moveBlock = ( index: number, delta: number ) => {
		const nextIndex = index + delta;
		if ( nextIndex < 0 || nextIndex >= blocks.length ) return;
		const next = [ ...blocks ];
		[ next[ index ], next[ nextIndex ] ] = [ next[ nextIndex ], next[ index ] ];
		setBlocks( next );
	};

	const addBlock = ( key: BlockKey ) => {
		if ( ! blocks.includes( key ) ) setBlocks( [ ...blocks, key ] );
		setInserterOpen( false );
	};

	return (
		<Page title="MegaSwing 360" ariaLabel="MegaSwing 360 Object Card OS">
			<style>{ css }</style>
			<div className={ `ms360 ${ layoutMode === 'magazine' ? 'is-magazine' : '' } ${ layoutMode === 'dense' ? 'is-dense' : '' }` }>
				<div className="ms360__top">
					<div className="ms360__brand">MegaSwing 360</div>
					<div className="ms360__crumb">철도 전망 호텔 / Objects / { selected.title }</div>
					<button type="button" className="ms360__topBtn">＋ 객체</button>
					<button type="button" className="ms360__topBtn">↓ 업데이트</button>
				</div>
				<div className="ms360__layout">
					<aside className="ms360__sidebar">
						<div className="ms360__navLabel">소설</div>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">⌂</span>홈</button>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">✎</span>원고</button>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">▦</span>장면</button>
						<div className="ms360__navLabel">Objects</div>
						{ OBJECTS.map( ( item ) => <button type="button" key={ item.id } onClick={ () => setSelectedId( item.id ) } className={ `ms360__nav ${ item.id === selectedId ? 'is-active' : '' }` }><span className="ms360__navGlyph">{ item.glyph }</span><span>{ item.title }</span></button> ) }
						<div className="ms360__navLabel">Visual</div>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">⌘</span>Story Map</button>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">≈</span>Timeline</button>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">▤</span>Matrix</button>
					</aside>

					<main className="ms360__main">
						<section className="ms360__hero">
							<div className="ms360__avatar">{ selected.glyph }</div>
							<div><small>{ selected.kind.toUpperCase() } OBJECT</small><h2>{ selected.title }</h2><div className="ms360__heroMeta">{ selected.meta }</div></div>
							<span className="ms360__live">LIVE OBJECT</span>
						</section>

						<div className="ms360__workspace">
							{ blocks.map( ( block, index ) => <section key={ block } className={ `ms360__block ${ [ 'storyArc', 'scenes', 'manuscript', 'timeline' ].includes( block ) ? 'is-wide' : '' }` }>
								<div className="ms360__blockHead"><b>{ BLOCK_LABELS[ block ] }</b><small>SiYuan 원본 객체 실시간 투영</small><div className="ms360__blockTools"><button type="button" onClick={ () => moveBlock( index, -1 ) }>↑</button><button type="button" onClick={ () => moveBlock( index, 1 ) }>↓</button><button type="button" onClick={ () => setBlocks( blocks.filter( ( key ) => key !== block ) ) }>×</button></div></div>
								<BlockBody block={ block } />
							</section> ) }
						</div>

						<button type="button" className="ms360__add" onClick={ () => setInserterOpen( ! inserterOpen ) }>＋ Gutenberg식 Plugin Block 추가</button>
						{ inserterOpen && <div className="ms360__palette">{ INSERTABLE_BLOCKS.map( ( item ) => <button type="button" key={ item.key } onClick={ () => addBlock( item.key ) }><b>{ item.icon } { item.label }</b><span>{ item.description }</span></button> ) }</div> }
					</main>

					<aside className="ms360__inspector">
						<div className="ms360__inspectTitle">페이지 스타일</div>
						<div className="ms360__modeRow">{ ( [ 'cards', 'magazine', 'dense' ] as LayoutMode[] ).map( ( mode ) => <button type="button" key={ mode } onClick={ () => setLayoutMode( mode ) } className={ `ms360__modeBtn ${ layoutMode === mode ? 'is-active' : '' }` }>{ mode === 'cards' ? 'Cards' : mode === 'magazine' ? 'Magazine' : 'Dense' }</button> ) }</div>
						<div className="ms360__inspectTitle">현재 객체</div>
						<div className="ms360__inspectBox"><small>Object</small><b>{ selected.title }</b></div>
						<div className="ms360__inspectBox"><small>Type</small><b>{ selected.kind }</b></div>
						<div className="ms360__inspectBox"><small>Project</small><b>철도 전망 호텔</b></div>
						<div className="ms360__inspectTitle">데이터 원칙</div>
						<p className="ms360__hint">카드 안에 정보를 복사하지 않습니다. Character·Scene·Theme·Question·Answer·Fact·Motif 원본을 조회해서 하나의 Object Page에 조립합니다.</p>
						<div className="ms360__inspectTitle">Plugin Blocks</div>
						<div className="ms360__chips"><span className="ms360__chip">Character</span><span className="ms360__chip">Scene</span><span className="ms360__chip">Theme</span><span className="ms360__chip">Motif</span><span className="ms360__chip">Fact</span><span className="ms360__chip">Q&A</span></div>
					</aside>
				</div>
			</div>
		</Page>
	);
}

export const stage = MegaSwingDashboard;
