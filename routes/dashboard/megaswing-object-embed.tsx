import { useBlockProps } from '@wordpress/block-editor';
import { getBlockType, registerBlockType } from '@wordpress/blocks';
import { useMegaSwingObjectContext } from './megaswing-context';

const BLOCK_NAME = 'megaswing/object-embed';

const objectEmbedCss = `
.ms360-object-embed__picker{display:grid;grid-template-columns:70px 1fr;gap:8px;align-items:center;margin:8px 0 10px;font-size:11px}.ms360-object-embed__picker span{color:var(--ms-muted)}.ms360-object-embed__picker select{width:100%;min-width:0;border:1px solid var(--ms-border);border-radius:8px;background:var(--ms-panel);color:inherit;padding:7px 8px}.ms360-object-embed__hero{width:100%;display:grid;grid-template-columns:42px minmax(0,1fr) 20px;align-items:center;gap:9px;text-align:left;border:1px solid var(--ms-border);border-radius:11px;background:var(--ms-panel);color:inherit;padding:10px;cursor:pointer}.ms360-object-embed__hero:hover{border-color:var(--ms-accent)}.ms360-object-embed__hero>span{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--ms-soft);color:var(--ms-accent);font-weight:700}.ms360-object-embed__hero div{min-width:0}.ms360-object-embed__hero b,.ms360-object-embed__hero small{display:block}.ms360-object-embed__hero small{color:var(--ms-muted);font-size:10px;margin-top:2px}.ms360-object-embed__hero p{margin:5px 0 0;font-size:10px;line-height:1.45;color:var(--ms-muted)}.ms360-object-embed__hero i{font-style:normal;color:var(--ms-muted)}.ms360-object-embed__toggles{display:flex;gap:10px;flex-wrap:wrap;margin:9px 0;font-size:10px;color:var(--ms-muted)}.ms360-object-embed__toggles label{display:flex;gap:4px;align-items:center}.ms360-object-embed__strip{border-top:1px solid var(--ms-border);padding-top:7px;margin-top:7px}.ms360-object-embed__strip>b{display:block;font-size:9px;letter-spacing:.08em;color:var(--ms-muted);margin-bottom:5px}.ms360-object-embed__strip>div{display:flex;gap:4px;flex-wrap:wrap}.ms360-object-embed__strip span{border:1px solid var(--ms-border);border-radius:999px;padding:3px 6px;font-size:9px;background:var(--ms-panel)}
`;

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
			<style>{ objectEmbedCss }</style>
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
