import {
	BlockEditorProvider,
	BlockInspector,
	BlockList,
} from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { Page } from '@wordpress/admin-ui';
import { useMemo, useState } from '@wordpress/element';
import {
	MEGASWING_CARD_DEFINITIONS,
	createMegaSwingCardBlock,
	createMegaSwingObjectTemplate,
	registerMegaSwingBlocks,
	type MegaSwingCardKey,
} from './megaswing-blocks';
import {
	MEGASWING_OBJECTS,
	getMegaSwingObject,
} from './megaswing-data';

registerMegaSwingBlocks();

const shellCss = `
.ms360{--ms-accent:#7c3aed;--ms-card:color-mix(in srgb,currentColor 4%,transparent);--ms-border:color-mix(in srgb,currentColor 15%,transparent);--ms-soft:color-mix(in srgb,var(--ms-accent) 12%,transparent);color:inherit;min-height:100%;}
.ms360 *{box-sizing:border-box}.ms360 button{font:inherit;color:inherit}.ms360__top{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--ms-border)}.ms360__brand{font-weight:700;margin-right:auto}.ms360__crumb{font-size:12px;opacity:.62}.ms360__topBtn,.ms360__modeBtn,.ms360__add{border:1px solid var(--ms-border);background:transparent;border-radius:8px;padding:6px 9px;cursor:pointer}.ms360__topBtn:hover,.ms360__modeBtn:hover,.ms360__add:hover{border-color:var(--ms-accent)}
.ms360__layout{display:grid;grid-template-columns:190px minmax(0,1fr) 238px;min-height:760px}.ms360__sidebar{padding:12px;border-right:1px solid var(--ms-border)}.ms360__inspector{padding:12px;border-left:1px solid var(--ms-border)}.ms360__navLabel{font-size:10px;letter-spacing:.08em;opacity:.5;margin:10px 8px 5px;text-transform:uppercase}.ms360__nav{width:100%;text-align:left;border:0;background:transparent;border-radius:8px;padding:8px;cursor:pointer;display:flex;align-items:center;gap:8px}.ms360__nav:hover,.ms360__nav.is-active{background:var(--ms-soft)}.ms360__navGlyph{width:28px;height:28px;border-radius:8px;background:var(--ms-card);display:grid;place-items:center;font-size:11px;flex:0 0 auto}.ms360__navCopy{display:flex;flex-direction:column;min-width:0}.ms360__navCopy b{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms360__navCopy small{font-size:9px;opacity:.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ms360__main{padding:14px;min-width:0}.ms360__hero{display:flex;align-items:center;gap:12px;border:1px solid var(--ms-border);border-radius:14px;padding:14px;margin-bottom:12px;background:var(--ms-card)}.ms360__avatar{width:56px;height:56px;border-radius:50%;background:color-mix(in srgb,var(--ms-accent) 18%,transparent);color:var(--ms-accent);display:grid;place-items:center;font-weight:800;font-size:18px}.ms360__hero small{font-size:10px;opacity:.55;display:block}.ms360__hero h2{font-size:20px;margin:2px 0 3px}.ms360__heroMeta{font-size:12px;opacity:.65}.ms360__live{margin-left:auto;border:1px solid color-mix(in srgb,var(--ms-accent) 50%,transparent);color:var(--ms-accent);border-radius:999px;padding:4px 8px;font-size:10px;font-weight:700}
.ms360__canvas{border:1px solid var(--ms-border);border-radius:14px;background:color-mix(in srgb,currentColor 1.5%,transparent);padding:10px}.ms360__canvas .block-editor-block-list__layout{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ms360__canvas .block-editor-block-list__block{margin:0!important;max-width:none!important}.ms360__canvas .block-editor-block-list__block:has(> .ms360-card.is-wide){grid-column:1/-1}.ms360__canvas .block-editor-block-list__block .block-editor-block-list__block-edit{margin:0}.ms360__canvas .block-list-appender{grid-column:1/-1}
.ms360-card{border:1px solid var(--ms-border);border-radius:12px;background:var(--ms-card);padding:11px;min-height:100%;margin:0!important}.ms360-card:focus,.ms360-card.is-selected{border-color:var(--ms-accent)}.ms360-card__head{display:flex;align-items:center;gap:8px;margin-bottom:10px}.ms360-card__icon{width:30px;height:30px;border-radius:8px;background:var(--ms-soft);color:var(--ms-accent);display:grid;place-items:center;font-weight:700}.ms360-card__head>div{display:flex;flex-direction:column;min-width:0}.ms360-card__head b{font-size:12px}.ms360-card__head small{font-size:9px;opacity:.5}.ms360-card__source{margin-left:auto;font-size:9px;opacity:.45}.ms360-card__summary,.ms360-card__manuscript{font-size:11px;line-height:1.65;opacity:.72;margin:0 0 10px}.ms360-card__kv{display:grid;grid-template-columns:70px 1fr;gap:8px;margin:7px 0;font-size:11px}.ms360-card__kv span{opacity:.5}.ms360-card__sceneGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.ms360-card__scene{border:1px solid var(--ms-border);border-radius:8px;padding:8px 6px;text-align:left;background:transparent;cursor:pointer;display:flex;flex-direction:column}.ms360-card__scene:hover{border-color:var(--ms-accent);background:var(--ms-soft)}.ms360-card__scene b{font-size:11px}.ms360-card__scene span{font-size:10px}.ms360-card__scene small{font-size:9px;opacity:.5;margin-top:3px}.ms360-card__chips{display:flex;gap:5px;flex-wrap:wrap}.ms360-card__chip{border:1px solid var(--ms-border);border-radius:999px;padding:4px 7px;font-size:10px}.ms360-card__chip.is-known{background:var(--ms-soft);border-color:color-mix(in srgb,var(--ms-accent) 35%,transparent)}.ms360-card__bar{display:grid;grid-template-columns:52px 1fr 20px;gap:7px;align-items:center;margin:7px 0;font-size:10px}.ms360-card__track{height:8px;border-radius:999px;background:var(--ms-border);overflow:hidden}.ms360-card__track i{display:block;height:100%;background:var(--ms-accent);border-radius:inherit}.ms360-card__qa+.ms360-card__qa{border-top:1px solid var(--ms-border);padding-top:8px;margin-top:8px}.ms360-card__qa b{font-size:11px}.ms360-card__qa p{font-size:10px;line-height:1.55;opacity:.65;margin:4px 0 0}.ms360-card__motif{display:grid;grid-template-columns:80px 1fr;gap:7px;align-items:center;margin:7px 0;font-size:10px}.ms360-card__steps{display:flex;gap:3px;flex-wrap:wrap}.ms360-card__step{border:1px solid var(--ms-border);border-radius:5px;padding:4px 6px;opacity:.45}.ms360-card__step.is-on{opacity:1;background:var(--ms-soft);border-color:color-mix(in srgb,var(--ms-accent) 45%,transparent)}.ms360-card__arc{display:flex;align-items:center;overflow:auto}.ms360-card__arcPiece{display:flex;align-items:center}.ms360-card__arrow{opacity:.35;margin:0 4px}.ms360-card__arcNode{min-width:90px;border:1px solid var(--ms-border);border-radius:8px;padding:7px;display:flex;flex-direction:column}.ms360-card__arcNode b{font-size:10px}.ms360-card__arcNode span{font-size:10px}.ms360-card__arcNode small{font-size:9px;opacity:.5}.ms360-card__action{border:1px solid var(--ms-border);border-radius:7px;background:transparent;padding:6px 8px;font-size:10px;cursor:pointer}.ms360-card__action:hover{border-color:var(--ms-accent)}.ms360-card__relations{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;align-items:center}.ms360-card__relationCenter{grid-column:2;grid-row:1/3;border:1px solid var(--ms-accent);background:var(--ms-soft);border-radius:12px;padding:16px;text-align:center;display:flex;flex-direction:column}.ms360-card__relation{border:1px solid var(--ms-border);border-radius:8px;padding:8px;font-size:10px;text-align:center}.ms360-card__timeline{display:flex;align-items:center;gap:0;overflow:auto}.ms360-card__timeItem{display:grid;grid-template-columns:auto 40px auto;align-items:center;min-width:max-content;font-size:10px}.ms360-card__timeItem i{height:1px;background:var(--ms-border);display:block;margin:0 6px}.ms360-card__metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.ms360-card__metrics span{border:1px solid var(--ms-border);border-radius:8px;padding:9px;text-align:center;display:flex;flex-direction:column}.ms360-card__metrics b{font-size:15px}.ms360-card__metrics small{font-size:9px;opacity:.5}.ms360-card__revision{display:flex;gap:5px;flex-wrap:wrap}.ms360-card__revision span{border:1px solid var(--ms-border);border-radius:7px;padding:6px 8px;font-size:10px}.ms360-card__revision .is-done{background:var(--ms-soft);border-color:color-mix(in srgb,var(--ms-accent) 35%,transparent)}.ms360-card__empty{font-size:10px;opacity:.5;margin:0}
.ms360__add{width:100%;margin-top:10px;border-style:dashed;padding:10px;opacity:.72}.ms360__palette{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}.ms360__palette button{border:1px solid var(--ms-border);background:transparent;border-radius:9px;text-align:left;padding:9px;cursor:pointer}.ms360__palette button:hover:not(:disabled){border-color:var(--ms-accent)}.ms360__palette button:disabled{opacity:.32;cursor:not-allowed}.ms360__palette b{display:block;font-size:11px}.ms360__palette span{font-size:9px;opacity:.55}.ms360__modeRow{display:flex;gap:4px}.ms360__modeBtn{flex:1;font-size:10px}.ms360__modeBtn.is-active{background:var(--ms-accent);color:white;border-color:var(--ms-accent)}.ms360__inspectTitle{font-size:11px;font-weight:700;margin:16px 0 7px}.ms360__inspectBox{border:1px solid var(--ms-border);border-radius:9px;padding:9px;margin-bottom:7px}.ms360__inspectBox small{font-size:9px;opacity:.5;display:block}.ms360__inspectBox b{font-size:11px}.ms360__hint{font-size:11px;line-height:1.6;opacity:.62}.ms360__nativeInspector{margin-top:8px;border-top:1px solid var(--ms-border);padding-top:8px}.ms360.is-magazine .ms360__canvas .block-editor-block-list__layout{display:block}.ms360.is-magazine .ms360__canvas .block-editor-block-list__block{margin-bottom:10px!important}.ms360.is-dense .ms360__canvas .block-editor-block-list__layout{grid-template-columns:repeat(3,minmax(0,1fr))}.ms360.is-dense .ms360__canvas .block-editor-block-list__block:has(> .ms360-card.is-wide){grid-column:span 2}
@media(max-width:1100px){.ms360__layout{grid-template-columns:170px minmax(0,1fr)}.ms360__inspector{display:none}.ms360__canvas .block-editor-block-list__layout,.ms360.is-dense .ms360__canvas .block-editor-block-list__layout{grid-template-columns:1fr}.ms360__canvas .block-editor-block-list__block:has(> .ms360-card.is-wide),.ms360.is-dense .ms360__canvas .block-editor-block-list__block:has(> .ms360-card.is-wide){grid-column:auto}}@media(max-width:720px){.ms360__layout{display:block}.ms360__sidebar{display:none}.ms360__crumb{display:none}.ms360__palette{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;

type LayoutMode = 'cards' | 'magazine' | 'dense';

function Dashboard() {
	const [ selectedObjectId, setSelectedObjectId ] = useState( 'yukio' );
	const [ layoutMode, setLayoutMode ] = useState<LayoutMode>( 'cards' );
	const [ paletteOpen, setPaletteOpen ] = useState( false );
	const [ objectLayouts, setObjectLayouts ] = useState<Record<string, BlockInstance[]>>( () => ( {
		yukio: createMegaSwingObjectTemplate( 'yukio' ),
	} ) );

	const selectedObject = getMegaSwingObject( selectedObjectId );
	const blocks = objectLayouts[ selectedObjectId ] ?? createMegaSwingObjectTemplate( selectedObjectId );
	const existingBlockNames = useMemo( () => new Set( blocks.map( ( block ) => block.name ) ), [ blocks ] );

	const updateBlocks = ( nextBlocks: BlockInstance[] ) => {
		setObjectLayouts( ( current ) => ( { ...current, [ selectedObjectId ]: nextBlocks } ) );
	};

	const selectObject = ( objectId: string ) => {
		setObjectLayouts( ( current ) => current[ objectId ] ? current : { ...current, [ objectId ]: createMegaSwingObjectTemplate( objectId ) } );
		setSelectedObjectId( objectId );
		setPaletteOpen( false );
	};

	const addBlock = ( card: MegaSwingCardKey ) => {
		updateBlocks( [ ...blocks, createMegaSwingCardBlock( card, selectedObjectId ) ] );
		setPaletteOpen( false );
	};

	const resetLayout = () => {
		updateBlocks( createMegaSwingObjectTemplate( selectedObjectId ) );
	};

	return (
		<BlockEditorProvider
			value={ blocks }
			onInput={ updateBlocks }
			onChange={ updateBlocks }
		>
			<style>{ shellCss }</style>
			<div className={ `ms360 ${ layoutMode === 'magazine' ? 'is-magazine' : '' } ${ layoutMode === 'dense' ? 'is-dense' : '' }` }>
				<header className="ms360__top">
					<strong className="ms360__brand">MegaSwing 360</strong>
					<span className="ms360__crumb">철도 전망 호텔 / { selectedObject.kind } / { selectedObject.title }</span>
					<button type="button" className="ms360__topBtn" onClick={ resetLayout }>↺ 템플릿 복원</button>
					<button type="button" className="ms360__topBtn">↓ 업데이트</button>
				</header>

				<div className="ms360__layout">
					<aside className="ms360__sidebar">
						<div className="ms360__navLabel">Objects</div>
						{ MEGASWING_OBJECTS.map( ( object ) => (
							<button
								type="button"
								key={ object.id }
								className={ `ms360__nav ${ object.id === selectedObjectId ? 'is-active' : '' }` }
								onClick={ () => selectObject( object.id ) }
							>
								<span className="ms360__navGlyph">{ object.glyph }</span>
								<span className="ms360__navCopy"><b>{ object.title }</b><small>{ object.kind }</small></span>
							</button>
						) ) }
						<div className="ms360__navLabel">Views</div>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">⌘</span><span className="ms360__navCopy"><b>Story Map</b><small>관계망</small></span></button>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">≈</span><span className="ms360__navCopy"><b>Timeline</b><small>시간축</small></span></button>
						<button type="button" className="ms360__nav"><span className="ms360__navGlyph">▤</span><span className="ms360__navCopy"><b>Matrix</b><small>인물 × 주제</small></span></button>
					</aside>

					<main className="ms360__main">
						<section className="ms360__hero">
							<div className="ms360__avatar">{ selectedObject.glyph }</div>
							<div><small>LIVE GUTENBERG OBJECT</small><h2>{ selectedObject.title }</h2><div className="ms360__heroMeta">{ selectedObject.meta }</div></div>
							<span className="ms360__live">{ blocks.length } BLOCKS</span>
						</section>

						<div className="ms360__canvas">
							<BlockList />
						</div>

						<button type="button" className="ms360__add" onClick={ () => setPaletteOpen( ( open ) => ! open ) }>＋ Gutenberg Plugin Block 추가</button>
						{ paletteOpen && (
							<div className="ms360__palette">
								{ MEGASWING_CARD_DEFINITIONS.map( ( definition ) => {
									const blockName = `megaswing/${ definition.key }`;
									const alreadyAdded = existingBlockNames.has( blockName );
									return <button type="button" key={ definition.key } disabled={ alreadyAdded } onClick={ () => addBlock( definition.key ) }><b>{ definition.icon } { definition.title }</b><span>{ alreadyAdded ? '이미 이 Object에 있음' : definition.description }</span></button>;
								} ) }
							</div>
						) }
					</main>

					<aside className="ms360__inspector">
						<div className="ms360__inspectTitle">레이아웃</div>
						<div className="ms360__modeRow">
							{ ( [ 'cards', 'magazine', 'dense' ] as LayoutMode[] ).map( ( mode ) => <button type="button" key={ mode } className={ `ms360__modeBtn ${ layoutMode === mode ? 'is-active' : '' }` } onClick={ () => setLayoutMode( mode ) }>{ mode }</button> ) }
						</div>
						<div className="ms360__inspectTitle">현재 객체</div>
						<div className="ms360__inspectBox"><small>Object</small><b>{ selectedObject.title }</b></div>
						<div className="ms360__inspectBox"><small>Kind</small><b>{ selectedObject.kind }</b></div>
						<div className="ms360__inspectBox"><small>Source</small><b>Object Resolver → Gutenberg Blocks</b></div>
						<p className="ms360__hint">Scene·Theme·Answer·Fact를 카드 안에 복사하지 않고, objectId를 가진 Gutenberg Block이 resolver에서 원본 객체를 다시 읽어 표시합니다.</p>
						<div className="ms360__inspectTitle">선택 Block</div>
						<div className="ms360__nativeInspector"><BlockInspector /></div>
					</aside>
				</div>
			</div>
		</BlockEditorProvider>
	);
}

function Stage() {
	return (
		<Page title="MegaSwing 360" ariaLabel="MegaSwing 360" hasPadding={ false }>
			<Dashboard />
		</Page>
	);
}

export const stage = Stage;
