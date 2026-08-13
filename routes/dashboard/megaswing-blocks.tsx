import { useBlockProps } from '@wordpress/block-editor';
import {
	createBlock,
	getBlockType,
	registerBlockType,
	type Block,
} from '@wordpress/blocks';
import { useMegaSwingObjectContext } from './megaswing-context';
import type { MegaSwingObject } from './megaswing-data';
import { megaSwingResolver } from './megaswing-resolver';

export type MegaSwingCardKey =
	| 'profile'
	| 'story-arc'
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

type MegaSwingBlockAttributes = {
	objectId?: string;
};

type CardDefinition = {
	key: MegaSwingCardKey;
	title: string;
	description: string;
	icon: string;
	wide?: boolean;
};

export const MEGASWING_CARD_DEFINITIONS: CardDefinition[] = [
	{ key: 'profile', title: 'Object Profile', description: '현재 객체의 핵심 속성', icon: '◉' },
	{ key: 'story-arc', title: 'Story Arc', description: '연결 장면의 순서와 역할', icon: '→', wide: true },
	{ key: 'scenes', title: 'Scene Cards', description: '이 객체와 연결된 장면 카드', icon: '▦', wide: true },
	{ key: 'situations', title: 'Situations', description: '객체가 개입한 상황과 사건', icon: '!' },
	{ key: 'themes', title: 'Themes', description: '연결 장면에서 집계한 주제', icon: '◇' },
	{ key: 'qa', title: 'Questions / Answers', description: '질문과 canonical Answer', icon: '?' },
	{ key: 'knowledge', title: 'Knowledge', description: 'Fact × Character 지식 상태', icon: '◆' },
	{ key: 'motifs', title: 'Motif Flow', description: '설치·반복·변형·회수 흐름', icon: '≈' },
	{ key: 'manuscript', title: 'Related Manuscript', description: '연결 원고를 이어서 보기', icon: '✎', wide: true },
	{ key: 'relationships', title: 'Relationship Map', description: '연결 객체를 탐색', icon: '⌘', wide: true },
	{ key: 'timeline', title: 'Story Time', description: '원고 순서와 사건 시간', icon: '⌚', wide: true },
	{ key: 'voice', title: 'Voice Lab', description: 'POV 문장과 대화 지문', icon: '◌' },
	{ key: 'revision', title: 'Revision', description: '객체별 수정 단계', icon: '↻' },
	{ key: 'locations', title: 'Locations', description: '객체가 거친 공간', icon: '⌖' },
	{ key: 'symbols', title: 'Symbols', description: '사물·이미지·감각 반복', icon: '✦' },
];

const definitionByKey = new Map(
	MEGASWING_CARD_DEFINITIONS.map( ( definition ) => [ definition.key, definition ] )
);

export const megaSwingBlockName = ( key: MegaSwingCardKey ) => `megaswing/${ key }`;

const percent = ( value: number, max: number ) =>
	`${ Math.max( 0, Math.min( 100, Math.round( ( value / Math.max( 1, max ) ) * 100 ) ) ) }%`;

function Empty( { children }: { children: string } ) {
	return <p className="ms360-card__empty">{ children }</p>;
}

function SceneCards( { object }: { object: MegaSwingObject } ) {
	const { resolver, openObject } = useMegaSwingObjectContext();
	if ( object.scenes.length === 0 ) return <Empty>연결된 Scene이 아직 없습니다.</Empty>;

	return (
		<div className="ms360-card__sceneGrid">
			{ object.scenes.map( ( scene ) => {
				const target = resolver.findObject( scene.id ) ?? resolver.findObjectByTitle( scene.title );
				return (
					<button
						type="button"
						className={ `ms360-card__scene ${ target ? 'is-linked' : '' }` }
						key={ `${ object.id }-${ scene.id }` }
						disabled={ ! target }
						onClick={ () => target && openObject( target.id ) }
					>
						<b>{ scene.order }</b>
						<span>{ scene.title }</span>
						{ scene.role && <small>{ scene.role }</small> }
					</button>
				);
			} ) }
		</div>
	);
}

function ThemeBars( { object }: { object: MegaSwingObject } ) {
	const { resolver, openObject } = useMegaSwingObjectContext();
	if ( object.themes.length === 0 ) return <Empty>연결된 Theme가 아직 없습니다.</Empty>;
	return (
		<div>
			{ object.themes.map( ( theme ) => {
				const target = resolver.findObjectByTitle( theme.label );
				return (
					<button
						type="button"
						className={ `ms360-card__bar ${ target ? 'is-linked' : '' }` }
						key={ `${ object.id }-${ theme.label }` }
						disabled={ ! target }
						onClick={ () => target && openObject( target.id ) }
					>
						<span>{ theme.label }</span>
						<i className="ms360-card__track"><i style={ { width: percent( theme.value, theme.max ) } } /></i>
						<b>{ theme.value }</b>
					</button>
				);
			} ) }
		</div>
	);
}

function ChipList( { items }: { items: string[] } ) {
	if ( items.length === 0 ) return <Empty>아직 연결된 항목이 없습니다.</Empty>;
	return <div className="ms360-card__chips">{ items.map( ( item ) => <span key={ item } className="ms360-card__chip">{ item }</span> ) }</div>;
}

function RelationshipCards( { object }: { object: MegaSwingObject } ) {
	const { resolver, openObject } = useMegaSwingObjectContext();
	if ( object.relations.length === 0 ) return <Empty>연결된 Object가 없습니다.</Empty>;
	return (
		<div className="ms360-card__relations">
			<div className="ms360-card__relationCenter"><span>{ object.glyph }</span><b>{ object.title }</b></div>
			{ object.relations.map( ( relation ) => {
				const relationTitle = relation.split( '·' )[ 0 ].trim();
				const target = resolver.findObjectByTitle( relationTitle );
				return (
					<button type="button" className="ms360-card__relation" disabled={ ! target } key={ relation } onClick={ () => target && openObject( target.id ) }>
						{ relation }
					</button>
				);
			} ) }
		</div>
	);
}

function CardBody( { card, object }: { card: MegaSwingCardKey; object: MegaSwingObject } ) {
	switch ( card ) {
		case 'profile':
			return <div><p className="ms360-card__summary">{ object.summary }</p>{ object.identity.map( ( row ) => <div className="ms360-card__kv" key={ row.label }><span>{ row.label }</span><b>{ row.value }</b></div> ) }</div>;
		case 'story-arc':
			return <div className="ms360-card__arc">{ object.scenes.length === 0 ? <Empty>Story Arc를 만들 Scene 연결이 없습니다.</Empty> : object.scenes.map( ( scene, index ) => <div className="ms360-card__arcPiece" key={ `arc-${ object.id }-${ scene.id }` }>{ index > 0 && <span className="ms360-card__arrow">→</span> }<div className="ms360-card__arcNode"><b>{ scene.order }</b><span>{ scene.title }</span>{ scene.role && <small>{ scene.role }</small> }</div></div> ) }</div>;
		case 'scenes':
			return <SceneCards object={ object } />;
		case 'situations':
			return <ChipList items={ object.situations } />;
		case 'themes':
			return <ThemeBars object={ object } />;
		case 'qa':
			return object.qa.length === 0 ? <Empty>연결된 Question / Answer가 없습니다.</Empty> : <div>{ object.qa.map( ( item ) => <div className="ms360-card__qa" key={ item.question }><b>{ item.question }</b><p>{ item.answer }</p></div> ) }</div>;
		case 'knowledge':
			return object.knowledge.length === 0 ? <Empty>Fact 지식 상태가 아직 없습니다.</Empty> : <div className="ms360-card__chips">{ object.knowledge.map( ( item ) => <span key={ item.label } className={ `ms360-card__chip ${ item.known ? 'is-known' : '' }` }>{ item.known ? '◆' : '◇' } { item.label }</span> ) }</div>;
		case 'motifs':
			return object.motifs.length === 0 ? <Empty>연결된 Motif가 아직 없습니다.</Empty> : <div>{ object.motifs.map( ( motif ) => <div className="ms360-card__motif" key={ motif.label }><b>{ motif.label }</b><div className="ms360-card__steps">{ motif.steps.map( ( step ) => <span key={ `${ motif.label }-${ step.label }` } className={ `ms360-card__step ${ step.state === 'on' ? 'is-on' : '' }` }>{ step.label }</span> ) }</div></div> ) }</div>;
		case 'manuscript':
			return <div><p className="ms360-card__manuscript">{ object.manuscript }</p><button type="button" className="ms360-card__action">{ object.title } 관련 원고만 이어보기</button></div>;
		case 'relationships':
			return <RelationshipCards object={ object } />;
		case 'timeline':
			return <div className="ms360-card__timeline">{ object.scenes.length === 0 ? <Empty>시간축에 배치할 Scene이 없습니다.</Empty> : object.scenes.map( ( scene ) => <div className="ms360-card__timeItem" key={ `time-${ object.id }-${ scene.id }` }><b>{ scene.order }</b><i /><span>{ scene.title }</span></div> ) }</div>;
		case 'voice':
			return <div className="ms360-card__metrics"><span><b>38자</b><small>평균 문장</small></span><span><b>8%</b><small>질문문</small></span><span><b>31%</b><small>대화 proxy</small></span><span><b>0.63</b><small>어휘 다양도</small></span></div>;
		case 'revision':
			return <div className="ms360-card__revision">{ [ '구조', '인물', '주제·복선', '문장', '교정', '제출' ].map( ( pass, index ) => <span className={ index < 2 ? 'is-done' : '' } key={ pass }>{ index < 2 ? '✓' : '○' } { pass }</span> ) }</div>;
		case 'locations':
			return <ChipList items={ object.locations } />;
		case 'symbols':
			return <ChipList items={ object.symbols } />;
	}
}

function MegaSwingCardEdit( { attributes, card }: { attributes: MegaSwingBlockAttributes; card: MegaSwingCardKey } ) {
	const { resolver } = useMegaSwingObjectContext();
	const object = resolver.resolveObject( attributes.objectId ?? 'yukio' );
	const definition = definitionByKey.get( card );
	const blockProps = useBlockProps( { className: `ms360-card ${ definition?.wide ? 'is-wide' : '' }` } );
	return (
		<section { ...blockProps }>
			<header className="ms360-card__head">
				<span className="ms360-card__icon">{ definition?.icon }</span>
				<div><b>{ definition?.title }</b><small>{ definition?.description }</small></div>
				<span className="ms360-card__source">{ object.kind.toUpperCase() }</span>
			</header>
			<CardBody card={ card } object={ object } />
		</section>
	);
}

export function registerMegaSwingBlocks() {
	MEGASWING_CARD_DEFINITIONS.forEach( ( definition ) => {
		const name = megaSwingBlockName( definition.key );
		if ( getBlockType( name ) ) return;
		registerBlockType( name, {
			apiVersion: 3,
			title: definition.title,
			description: definition.description,
			icon: 'screenoptions',
			category: 'widgets',
			attributes: { objectId: { type: 'string', default: 'yukio' } },
			supports: { html: false, customClassName: false },
			edit: ( props ) => <MegaSwingCardEdit attributes={ props.attributes as MegaSwingBlockAttributes } card={ definition.key } />,
			save: () => null,
		} );
	} );
}

const templatesByKind: Record<MegaSwingObject[ 'kind' ], MegaSwingCardKey[]> = {
	character: [ 'profile', 'story-arc', 'scenes', 'situations', 'themes', 'qa', 'knowledge', 'motifs', 'manuscript' ],
	scene: [ 'profile', 'scenes', 'situations', 'themes', 'knowledge', 'qa', 'motifs', 'relationships', 'locations', 'manuscript', 'revision' ],
	theme: [ 'profile', 'scenes', 'themes', 'qa', 'motifs', 'relationships', 'manuscript' ],
	motif: [ 'profile', 'story-arc', 'scenes', 'situations', 'themes', 'motifs', 'relationships', 'locations', 'symbols', 'manuscript' ],
	question: [ 'profile', 'qa', 'themes', 'relationships', 'manuscript' ],
	fact: [ 'profile', 'scenes', 'knowledge', 'themes', 'motifs', 'relationships', 'manuscript' ],
};

export function createMegaSwingObjectTemplate( objectId: string ): Block[] {
	const object = megaSwingResolver.resolveObject( objectId );
	return templatesByKind[ object.kind ].map( ( card ) => createBlock( megaSwingBlockName( card ), { objectId } ) );
}

export function createMegaSwingCardBlock( card: MegaSwingCardKey, objectId: string ): Block {
	return createBlock( megaSwingBlockName( card ), { objectId } );
}
