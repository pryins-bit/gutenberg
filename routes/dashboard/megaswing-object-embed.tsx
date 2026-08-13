import { useBlockProps } from '@wordpress/block-editor';
import { getBlockType, registerBlockType } from '@wordpress/blocks';
import { useMegaSwingObjectContext } from './megaswing-context';

const BLOCK_NAME = 'megaswing/object-embed';

type ObjectEmbedAttributes = {
	targetObjectId?: string;
	showScenes?: boolean;
	showThemes?: boolean;
	showRelations?: boolean;
};

function ObjectEmbedEdit( {
	attributes,
	setAttributes,
}: {
	attributes: ObjectEmbedAttributes;
	setAttributes: ( next: Partial<ObjectEmbedAttributes> ) => void;
} ) {
	const { resolver, openObject } = useMegaSwingObjectContext();
	const objects = resolver.listObjects();
	const targetObjectId = attributes.targetObjectId || objects[ 0 ]?.id || '';
	const target = targetObjectId ? resolver.resolveObject( targetObjectId ) : undefined;
	const blockProps = useBlockProps( { className: 'ms360-card ms360-object-embed' } );

	if ( ! target ) {
		return <section { ...blockProps }><p className="ms360-card__empty">표시할 Object가 없습니다.</p></section>;
	}

	return (
		<section { ...blockProps }>
			<header className="ms360-card__head">
				<span className="ms360-card__icon">{ target.glyph }</span>
				<div><b>Embedded Object</b><small>카드 안에 다른 객체를 직접 삽입</small></div>
				<span className="ms360-card__source">{ target.kind.toUpperCase() }</span>
			</header>

			<label className="ms360-object-embed__picker">
				<span>Object</span>
				<select value={ targetObjectId } onChange={ ( event ) => setAttributes( { targetObjectId: event.target.value } ) }>
					{ objects.map( ( object ) => <option value={ object.id } key={ object.id }>{ object.kind } · { object.title }</option> ) }
				</select>
			</label>

			<button type="button" className="ms360-object-embed__hero" onClick={ () => openObject( target.id ) }>
				<span>{ target.glyph }</span>
				<div><b>{ target.title }</b><small>{ target.meta }</small><p>{ target.summary }</p></div>
				<i>→</i>
			</button>

			<div className="ms360-object-embed__toggles">
				<label><input type="checkbox" checked={ attributes.showScenes !== false } onChange={ ( event ) => setAttributes( { showScenes: event.target.checked } ) } /> Scene</label>
				<label><input type="checkbox" checked={ attributes.showThemes !== false } onChange={ ( event ) => setAttributes( { showThemes: event.target.checked } ) } /> Theme</label>
				<label><input type="checkbox" checked={ attributes.showRelations !== false } onChange={ ( event ) => setAttributes( { showRelations: event.target.checked } ) } /> Relation</label>
			</div>

			{ attributes.showScenes !== false && target.scenes.length > 0 && (
				<div className="ms360-object-embed__strip">
					<b>SCENES</b>
					<div>{ target.scenes.slice( 0, 6 ).map( ( scene ) => <span key={ scene.id }>{ scene.order } · { scene.title }</span> ) }</div>
				</div>
			) }
			{ attributes.showThemes !== false && target.themes.length > 0 && (
				<div className="ms360-object-embed__strip">
					<b>THEMES</b>
					<div>{ target.themes.slice( 0, 6 ).map( ( theme ) => <span key={ theme.label }>◇ { theme.label } · { theme.value }</span> ) }</div>
				</div>
			) }
			{ attributes.showRelations !== false && target.relations.length > 0 && (
				<div className="ms360-object-embed__strip">
					<b>RELATIONS</b>
					<div>{ target.relations.slice( 0, 8 ).map( ( relation ) => <span key={ relation }>{ relation }</span> ) }</div>
				</div>
			) }
		</section>
	);
}

export function registerMegaSwingObjectEmbedBlock() {
	if ( getBlockType( BLOCK_NAME ) ) return;
	registerBlockType( BLOCK_NAME, {
		apiVersion: 3,
		title: 'MegaSwing Object Card',
		description: 'Character, Scene, Theme, Motif, Question, Fact 등 다른 객체를 현재 카드 페이지 안에 삽입합니다.',
		icon: 'index-card',
		category: 'widgets',
		attributes: {
			targetObjectId: { type: 'string', default: 'yukio' },
			showScenes: { type: 'boolean', default: true },
			showThemes: { type: 'boolean', default: true },
			showRelations: { type: 'boolean', default: true },
		},
		supports: { html: false, customClassName: false },
		edit: ObjectEmbedEdit,
		save: () => null,
	} );
}

registerMegaSwingObjectEmbedBlock();
