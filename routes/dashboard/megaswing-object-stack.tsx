import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { getBlockType, registerBlockType } from '@wordpress/blocks';
import { useMegaSwingObjectContext } from './megaswing-context';

const BLOCK_NAME = 'megaswing/object-stack';

const CHILD_BLOCKS = [
	'megaswing/profile',
	'megaswing/story-arc',
	'megaswing/scenes',
	'megaswing/situations',
	'megaswing/themes',
	'megaswing/qa',
	'megaswing/knowledge',
	'megaswing/motifs',
	'megaswing/relationships',
	'megaswing/timeline',
	'megaswing/voice',
	'megaswing/revision',
	'megaswing/locations',
	'megaswing/symbols',
	'megaswing/manuscript',
	'megaswing/object-embed',
];

const DEFAULT_TEMPLATE: [ string, Record<string, unknown> ][] = [
	[ 'megaswing/profile', {} ],
	[ 'megaswing/story-arc', {} ],
	[ 'megaswing/scenes', {} ],
	[ 'megaswing/situations', {} ],
	[ 'megaswing/themes', {} ],
	[ 'megaswing/qa', {} ],
	[ 'megaswing/knowledge', {} ],
	[ 'megaswing/motifs', {} ],
	[ 'megaswing/relationships', {} ],
	[ 'megaswing/manuscript', {} ],
];

type ObjectStackAttributes = {
	objectId?: string;
};

function ObjectStackEdit( {
	attributes,
	setAttributes,
}: {
	attributes: ObjectStackAttributes;
	setAttributes: ( next: Partial<ObjectStackAttributes> ) => void;
} ) {
	const { resolver } = useMegaSwingObjectContext();
	const objects = resolver.listObjects();
	const objectId = attributes.objectId || objects[ 0 ]?.id || '';
	const object = objectId ? resolver.resolveObject( objectId ) : undefined;
	const blockProps = useBlockProps( { className: 'ms360-object-stack' } );
	const template = DEFAULT_TEMPLATE.map( ( [ name ] ) => [ name, { objectId } ] as [ string, Record<string, unknown> ] );

	return (
		<section { ...blockProps }>
			<style>{ `
.ms360-object-stack{border:1px solid var(--ms-border);border-radius:16px;background:var(--ms-panel);padding:10px}.ms360-object-stack__head{display:grid;grid-template-columns:44px minmax(0,1fr) minmax(150px,230px);gap:10px;align-items:center;padding:4px 4px 12px}.ms360-object-stack__glyph{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--ms-soft);color:var(--ms-accent);font-weight:800}.ms360-object-stack__copy{min-width:0}.ms360-object-stack__copy small,.ms360-object-stack__copy b{display:block}.ms360-object-stack__copy small{font-size:9px;letter-spacing:.08em;color:var(--ms-muted)}.ms360-object-stack__copy b{font-size:15px;margin-top:2px}.ms360-object-stack__select{width:100%;min-width:0;border:1px solid var(--ms-border);border-radius:9px;background:var(--ms-card);color:inherit;padding:7px 8px}.ms360-object-stack .block-editor-block-list__layout{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.ms360-object-stack .block-editor-block-list__layout>.wp-block[data-type="megaswing/story-arc"],.ms360-object-stack .block-editor-block-list__layout>.wp-block[data-type="megaswing/scenes"],.ms360-object-stack .block-editor-block-list__layout>.wp-block[data-type="megaswing/relationships"],.ms360-object-stack .block-editor-block-list__layout>.wp-block[data-type="megaswing/manuscript"]{grid-column:1/-1}@media(max-width:800px){.ms360-object-stack__head{grid-template-columns:42px minmax(0,1fr)}.ms360-object-stack__select{grid-column:1/-1}.ms360-object-stack .block-editor-block-list__layout{grid-template-columns:1fr}}
` }</style>
			<header className="ms360-object-stack__head">
				<span className="ms360-object-stack__glyph">{ object?.glyph || '◉' }</span>
				<div className="ms360-object-stack__copy"><small>OBJECT STACK</small><b>{ object?.title || 'Object' }</b><small>{ object?.meta || '하위 카드를 하나의 객체 아래에 묶습니다.' }</small></div>
				<select className="ms360-object-stack__select" value={ objectId } onChange={ ( event ) => setAttributes( { objectId: event.target.value } ) }>
					{ objects.map( ( item ) => <option value={ item.id } key={ item.id }>{ item.kind } · { item.title }</option> ) }
				</select>
			</header>
			<InnerBlocks
				allowedBlocks={ CHILD_BLOCKS }
				template={ template }
				templateLock={ false }
				renderAppender={ InnerBlocks.ButtonBlockAppender }
			/>
		</section>
	);
}

export function registerMegaSwingObjectStackBlock() {
	if ( getBlockType( BLOCK_NAME ) ) return;
	registerBlockType( BLOCK_NAME, {
		apiVersion: 3,
		title: 'MegaSwing Object Stack',
		description: '인물·장면·주제 같은 하나의 객체 안에 Scene, Theme, Fact, Q&A, Motif 등 하위 카드를 Gutenberg InnerBlocks로 묶습니다.',
		icon: 'screenoptions',
		category: 'widgets',
		attributes: {
			objectId: { type: 'string', default: 'yukio' },
		},
		supports: { html: false, customClassName: false },
		edit: ObjectStackEdit,
		save: () => <InnerBlocks.Content />,
	} );
}
