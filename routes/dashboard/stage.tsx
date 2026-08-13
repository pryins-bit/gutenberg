import {
	BlockCanvas,
	BlockEditorProvider,
	BlockInspector,
} from '@wordpress/block-editor';
import type { Block } from '@wordpress/blocks';
import { Page } from '@wordpress/admin-ui';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { store as preferencesStore } from '@wordpress/preferences';
import {
	MEGASWING_CARD_DEFINITIONS,
	createMegaSwingCardBlock,
	createMegaSwingObjectTemplate,
	type MegaSwingCardKey,
} from './megaswing-blocks';
import { MegaSwingObjectProvider } from './megaswing-context';
import { registerMegaSwingEnvironment } from './megaswing-register';
import { megaSwingResolver } from './megaswing-resolver';
import {
	megaSwingCanvasStyles,
	megaSwingShellCss,
} from './megaswing-styles';
import {
	MegaSwingMatrix,
	MegaSwingStoryMap,
	MegaSwingTimeline,
	type MegaSwingVisualView,
} from './megaswing-views';

registerMegaSwingEnvironment();

type LayoutMode = keyof typeof megaSwingCanvasStyles;
type ObjectLayouts = Record<string, Block[]>;

const PREFERENCE_SCOPE = 'megaswing360';
const CARD_KEYS = new Set<MegaSwingCardKey>(
	MEGASWING_CARD_DEFINITIONS.map( ( definition ) => definition.key )
);
const kindOrder = [
	'project', 'character', 'scene', 'theme', 'question', 'answer', 'fact', 'motif',
	'material', 'location', 'time', 'situation', 'technique',
];

const blockNameToCardKey = ( name: string ): MegaSwingCardKey | undefined => {
	if ( ! name.startsWith( 'megaswing/' ) ) return;
	const key = name.slice( 'megaswing/'.length ) as MegaSwingCardKey;
	return CARD_KEYS.has( key ) ? key : undefined;
};

const blocksToCardKeys = ( blocks: Block[] ) =>
	blocks
		.map( ( block ) => blockNameToCardKey( block.name ) )
		.filter( ( key ): key is MegaSwingCardKey => Boolean( key ) );

const cardKeysToBlocks = ( objectId: string, keys: MegaSwingCardKey[] ) =>
	keys
		.filter( ( key ) => CARD_KEYS.has( key ) )
		.map( ( key ) => createMegaSwingCardBlock( key, objectId ) );

function ObjectNavigation( {
	selectedObjectId,
	activeView,
	onSelect,
	onView,
}: {
	selectedObjectId: string;
	activeView: MegaSwingVisualView;
	onSelect: ( objectId: string ) => void;
	onView: ( view: MegaSwingVisualView ) => void;
} ) {
	const [ query, setQuery ] = useState( '' );
	const [ kind, setKind ] = useState( 'all' );
	const allObjects = megaSwingResolver.listObjects();
	const kinds = useMemo(
		() => [ ...new Set( allObjects.map( ( object ) => object.kind ) ) ].sort(
			( a, b ) => kindOrder.indexOf( a ) - kindOrder.indexOf( b )
		),
		[ allObjects ]
	);
	const normalizedQuery = query.trim().toLocaleLowerCase();
	const visibleObjects = allObjects
		.filter( ( object ) => kind === 'all' || object.kind === kind )
		.filter( ( object ) => ! normalizedQuery || `${ object.title } ${ object.kind } ${ object.meta }`.toLocaleLowerCase().includes( normalizedQuery ) )
		.sort( ( a, b ) => {
			const aIndex = kindOrder.indexOf( a.kind );
			const bIndex = kindOrder.indexOf( b.kind );
			const kindDifference = ( aIndex < 0 ? 999 : aIndex ) - ( bIndex < 0 ? 999 : bIndex );
			return kindDifference || a.title.localeCompare( b.title, 'ko' );
		} );

	return (
		<aside className="ms360__sidebar">
			<div className="ms360__navLabel">Object Browser</div>
			<input
				value={ query }
				onChange={ ( event ) => setQuery( event.target.value ) }
				placeholder="객체 검색…"
				aria-label="객체 검색"
				style={ {
					width: '100%', border: '1px solid var(--ms-border)', borderRadius: '8px',
					background: 'transparent', color: 'inherit', padding: '7px 8px', marginBottom: '6px',
				} }
			/>
			<select
				value={ kind }
				onChange={ ( event ) => setKind( event.target.value ) }
				aria-label="객체 종류"
				style={ {
					width: '100%', border: '1px solid var(--ms-border)', borderRadius: '8px',
					background: 'transparent', color: 'inherit', padding: '7px 8px', marginBottom: '7px',
				} }
			>
				<option value="all">전체 객체 · { allObjects.length }</option>
				{ kinds.map( ( objectKind ) => (
					<option key={ objectKind } value={ objectKind }>
						{ objectKind } · { allObjects.filter( ( object ) => object.kind === objectKind ).length }
					</option>
				) ) }
			</select>

			<div className="ms360__navLabel">Visual Views</div>
			<button type="button" className={ `ms360__nav ${ activeView === 'object' ? 'is-active' : '' }` } onClick={ () => onView( 'object' ) }><span className="ms360__navGlyph">▣</span><span className="ms360__navCopy"><b>Object Cards</b><small>현재 객체 블록</small></span></button>
			<button type="button" className={ `ms360__nav ${ activeView === 'story-map' ? 'is-active' : '' }` } onClick={ () => onView( 'story-map' ) }><span className="ms360__navGlyph">⌘</span><span className="ms360__navCopy"><b>Story Map</b><small>관계망</small></span></button>
			<button type="button" className={ `ms360__nav ${ activeView === 'timeline' ? 'is-active' : '' }` } onClick={ () => onView( 'timeline' ) }><span className="ms360__navGlyph">≈</span><span className="ms360__navCopy"><b>Timeline</b><small>12 Scene</small></span></button>
			<button type="button" className={ `ms360__nav ${ activeView === 'matrix' ? 'is-active' : '' }` } onClick={ () => onView( 'matrix' ) }><span className="ms360__navGlyph">▤</span><span className="ms360__navCopy"><b>Matrix</b><small>10 인물 × 10 주제</small></span></button>

			<div className="ms360__navLabel">{ visibleObjects.length } Objects</div>
			{ visibleObjects.map( ( object ) => (
				<button
					type="button"
					key={ object.id }
					className={ `ms360__nav ${ activeView === 'object' && object.id === selectedObjectId ? 'is-active' : '' }` }
					onClick={ () => onSelect( object.id ) }
				>
					<span className="ms360__navGlyph">{ object.glyph }</span>
					<span className="ms360__navCopy"><b>{ object.title }</b><small>{ object.kind }</small></span>
				</button>
			) ) }
		</aside>
	);
}

function BlockPalette( { blocks, onAdd }: { blocks: Block[]; onAdd: ( card: MegaSwingCardKey ) => void } ) {
	const existingBlockNames = useMemo( () => new Set( blocks.map( ( block ) => block.name ) ), [ blocks ] );
	return (
		<div className="ms360__palette">
			{ MEGASWING_CARD_DEFINITIONS.map( ( definition ) => {
				const alreadyAdded = existingBlockNames.has( `megaswing/${ definition.key }` );
				return <button type="button" key={ definition.key } disabled={ alreadyAdded } onClick={ () => onAdd( definition.key ) }><b>{ definition.icon } { definition.title }</b><span>{ alreadyAdded ? '이미 이 Object에 있음' : definition.description }</span></button>;
			} ) }
		</div>
	);
}

function ObjectInspector( { objectId, layoutMode, onLayoutMode, activeView }: { objectId: string; layoutMode: LayoutMode; onLayoutMode: ( mode: LayoutMode ) => void; activeView: MegaSwingVisualView } ) {
	const object = megaSwingResolver.resolveObject( objectId );
	return (
		<aside className="ms360__inspector">
			<div className="ms360__inspectTitle">현재 화면</div>
			<div className="ms360__inspectBox"><small>View</small><b>{ activeView }</b></div>
			<div className="ms360__inspectTitle">레이아웃</div>
			<div className="ms360__modeRow">
				{ ( Object.keys( megaSwingCanvasStyles ) as LayoutMode[] ).map( ( mode ) => <button type="button" key={ mode } disabled={ activeView !== 'object' } className={ `ms360__modeBtn ${ layoutMode === mode ? 'is-active' : '' }` } onClick={ () => onLayoutMode( mode ) }>{ mode }</button> ) }
			</div>
			<div className="ms360__inspectTitle">현재 객체</div>
			<div className="ms360__inspectBox"><small>Object</small><b>{ object.title }</b></div>
			<div className="ms360__inspectBox"><small>Kind</small><b>{ object.kind }</b></div>
			<div className="ms360__inspectBox"><small>Source</small><b>objectId → Resolver</b></div>
			<p className="ms360__hint">원고·Answer·Fact 내용은 저장하지 않습니다. Preferences에는 이 Object의 카드 종류와 순서만 저장합니다.</p>
			{ activeView === 'object' && <><div className="ms360__inspectTitle">선택 Block</div><div className="ms360__nativeInspector"><BlockInspector /></div></> }
		</aside>
	);
}

function Dashboard() {
	const [ selectedObjectId, setSelectedObjectId ] = useState( 'project-rail-hotel' );
	const [ activeView, setActiveView ] = useState<MegaSwingVisualView>( 'object' );
	const [ layoutMode, setLayoutMode ] = useState<LayoutMode>( 'cards' );
	const [ paletteOpen, setPaletteOpen ] = useState( false );
	const [ objectLayouts, setObjectLayouts ] = useState<ObjectLayouts>( {} );
	const { set: setPreference } = useDispatch( preferencesStore );
	const savedLayout = useSelect(
		( select ) => select( preferencesStore ).get( PREFERENCE_SCOPE, `layout:${ selectedObjectId }` ) as MegaSwingCardKey[] | undefined,
		[ selectedObjectId ]
	);

	const selectedObject = megaSwingResolver.resolveObject( selectedObjectId );
	const persistedOrDefaultBlocks = useMemo(
		() => savedLayout?.length ? cardKeysToBlocks( selectedObjectId, savedLayout ) : createMegaSwingObjectTemplate( selectedObjectId ),
		[ savedLayout, selectedObjectId ]
	);
	const blocks = objectLayouts[ selectedObjectId ] ?? persistedOrDefaultBlocks;

	const updateBlocks = ( nextBlocks: Block[] ) => {
		setObjectLayouts( ( current ) => ( { ...current, [ selectedObjectId ]: nextBlocks } ) );
		setPreference( PREFERENCE_SCOPE, `layout:${ selectedObjectId }`, blocksToCardKeys( nextBlocks ) );
	};

	const openObject = ( objectId: string ) => {
		if ( ! megaSwingResolver.findObject( objectId ) ) return;
		setSelectedObjectId( objectId );
		setActiveView( 'object' );
		setPaletteOpen( false );
	};
	const addBlock = ( card: MegaSwingCardKey ) => {
		updateBlocks( [ ...blocks, createMegaSwingCardBlock( card, selectedObjectId ) ] );
		setPaletteOpen( false );
	};
	const resetLayout = () => updateBlocks( createMegaSwingObjectTemplate( selectedObjectId ) );
	const canvasStyles = [ ...megaSwingCanvasStyles[ layoutMode ] ];

	return (
		<MegaSwingObjectProvider openObject={ openObject } resolver={ megaSwingResolver }>
			<BlockEditorProvider value={ blocks } onInput={ updateBlocks } onChange={ updateBlocks }>
				<style>{ megaSwingShellCss }</style>
				<div className="ms360">
					<header className="ms360__top">
						<strong className="ms360__brand">MegaSwing 360</strong>
						<span className="ms360__crumb">철도 전망 호텔 / { activeView } / { selectedObject.title }</span>
						<button type="button" className="ms360__topBtn" onClick={ () => openObject( 'project-rail-hotel' ) }>▣ 프로젝트</button>
						{ activeView === 'object' && <button type="button" className="ms360__topBtn" onClick={ resetLayout }>↺ 템플릿</button> }
						<button type="button" className="ms360__topBtn">↓ 업데이트</button>
					</header>
					<div className="ms360__layout">
						<ObjectNavigation selectedObjectId={ selectedObjectId } activeView={ activeView } onSelect={ openObject } onView={ setActiveView } />
						<main className="ms360__main">
							<section className="ms360__hero">
								<div className="ms360__avatar">{ selectedObject.glyph }</div>
								<div><small>{ activeView === 'object' ? 'LIVE GUTENBERG OBJECT' : 'VISUAL LENS' }</small><h2>{ selectedObject.title }</h2><div className="ms360__heroMeta">{ selectedObject.meta }</div></div>
								<span className="ms360__live">{ activeView === 'object' ? `${ blocks.length } BLOCKS` : activeView.toUpperCase() }</span>
							</section>

							{ activeView === 'object' && <><div className="ms360__canvasWrap"><BlockCanvas height="680px" styles={ canvasStyles } /></div><button type="button" className="ms360__add" onClick={ () => setPaletteOpen( ( open ) => ! open ) }>＋ Gutenberg Plugin Block 추가</button>{ paletteOpen && <BlockPalette blocks={ blocks } onAdd={ addBlock } /> }</> }
							{ activeView === 'story-map' && <MegaSwingStoryMap objectId={ selectedObjectId } /> }
							{ activeView === 'timeline' && <MegaSwingTimeline /> }
							{ activeView === 'matrix' && <MegaSwingMatrix /> }
						</main>
						<ObjectInspector objectId={ selectedObjectId } layoutMode={ layoutMode } onLayoutMode={ setLayoutMode } activeView={ activeView } />
					</div>
				</div>
			</BlockEditorProvider>
		</MegaSwingObjectProvider>
	);
}

function Stage() {
	return <Page title="MegaSwing 360" ariaLabel="MegaSwing 360" hasPadding={ false }><Dashboard /></Page>;
}

export const stage = Stage;
