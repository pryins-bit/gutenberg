import { useMegaSwingObjectContext } from './megaswing-context';

export type MegaSwingVisualView = 'object' | 'story-map' | 'timeline' | 'matrix';

const viewCss = `
.ms360-view{border:1px solid var(--ms-border);border-radius:14px;background:color-mix(in srgb,currentColor 2%,transparent);padding:14px;min-height:520px}.ms360-view__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.ms360-view__head h3{font-size:16px;margin:0 0 3px}.ms360-view__head p{font-size:11px;opacity:.58;margin:0}.ms360-view__badge{font-size:10px;border:1px solid var(--ms-border);border-radius:999px;padding:5px 8px}.ms360-map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:stretch}.ms360-map__center{grid-column:2;grid-row:2;border:1px solid var(--ms-accent);background:var(--ms-soft);border-radius:16px;padding:18px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:130px}.ms360-map__center span{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--ms-accent) 18%,transparent);color:var(--ms-accent);font-weight:800;margin-bottom:7px}.ms360-map__center b{font-size:14px}.ms360-map__center small{font-size:9px;opacity:.52}.ms360-map__node{border:1px solid var(--ms-border);border-radius:12px;background:var(--ms-card);padding:11px;text-align:left;cursor:pointer;min-height:85px}.ms360-map__node:hover{border-color:var(--ms-accent);background:var(--ms-soft)}.ms360-map__node b{display:block;font-size:11px}.ms360-map__node small{display:block;font-size:9px;opacity:.52;margin-top:3px}.ms360-map__empty{grid-column:1/-1;text-align:center;opacity:.5;font-size:11px;padding:50px 0}.ms360-timeline{display:flex;gap:8px;align-items:stretch;overflow-x:auto;padding:8px 2px 14px}.ms360-timeline__scene{min-width:145px;border:1px solid var(--ms-border);border-radius:12px;background:var(--ms-card);padding:11px;text-align:left;cursor:pointer;position:relative}.ms360-timeline__scene:hover{border-color:var(--ms-accent);background:var(--ms-soft)}.ms360-timeline__scene::after{content:'→';position:absolute;right:-10px;top:50%;z-index:2;opacity:.35}.ms360-timeline__scene:last-child::after{display:none}.ms360-timeline__scene strong{display:block;color:var(--ms-accent);font-size:11px}.ms360-timeline__scene b{display:block;font-size:11px;margin:4px 0}.ms360-timeline__scene small{font-size:9px;opacity:.52}.ms360-matrixScroll{overflow:auto;border:1px solid var(--ms-border);border-radius:12px}.ms360-matrix{border-collapse:collapse;min-width:920px;width:100%;background:var(--ms-card)}.ms360-matrix th,.ms360-matrix td{border:1px solid var(--ms-border);padding:5px;text-align:center;font-size:9px}.ms360-matrix th{position:sticky;top:0;background:var(--ms-card);z-index:1}.ms360-matrix th:first-child{left:0;z-index:2}.ms360-matrix td:first-child{position:sticky;left:0;background:var(--ms-card);text-align:left;z-index:1}.ms360-matrix button{border:0;background:transparent;color:inherit;cursor:pointer;padding:4px;border-radius:5px;font-size:9px}.ms360-matrix button:hover{background:var(--ms-soft);color:var(--ms-accent)}.ms360-matrix__cell{width:100%;height:28px}.ms360-matrix__cell.is-hit{background:var(--ms-soft);color:var(--ms-accent);font-weight:700}.ms360-matrix__legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:9px;font-size:9px;opacity:.6}@media(max-width:800px){.ms360-map{grid-template-columns:1fr}.ms360-map__center{grid-column:1;grid-row:auto;order:-1}.ms360-view{min-height:420px}}
`;

const sceneOrder = ( title: string ) => {
	const match = title.match( /^\s*(\d+)/ );
	return match ? Number( match[ 1 ] ) : 999;
};

export function MegaSwingStoryMap( { objectId }: { objectId: string } ) {
	const { resolver, openObject } = useMegaSwingObjectContext();
	const object = resolver.resolveObject( objectId );
	const candidates = [
		...object.scenes.map( ( scene ) => resolver.findObject( scene.id ) ?? resolver.findObjectByTitle( scene.title ) ),
		...object.relations.map( ( relation ) => resolver.findObjectByTitle( relation.split( '·' )[ 0 ].trim() ) ),
		...object.themes.map( ( theme ) => resolver.findObjectByTitle( theme.label ) ),
		...object.motifs.map( ( motif ) => resolver.findObjectByTitle( motif.label ) ),
		...object.locations.map( ( location ) => resolver.findObjectByTitle( location ) ),
	].filter( Boolean );
	const related = [ ...new Map( candidates.map( ( target ) => [ target?.id, target ] ) ).values() ].filter( ( target ) => target && target.id !== object.id ).slice( 0, 12 );

	return (
		<section className="ms360-view">
			<style>{ viewCss }</style>
			<header className="ms360-view__head"><div><h3>Story Map</h3><p>현재 Object를 중심으로 Scene·Theme·Motif·Location·Relation을 한 번에 탐색합니다.</p></div><span className="ms360-view__badge">{ related.length } LINKS</span></header>
			<div className="ms360-map">
				<div className="ms360-map__center"><span>{ object.glyph }</span><b>{ object.title }</b><small>{ object.kind }</small></div>
				{ related.length === 0 && <div className="ms360-map__empty">연결된 Object가 아직 없습니다.</div> }
				{ related.map( ( target ) => target && <button type="button" className="ms360-map__node" key={ target.id } onClick={ () => openObject( target.id ) }><b>{ target.glyph } { target.title }</b><small>{ target.kind } · { target.meta }</small></button> ) }
			</div>
		</section>
	);
}

export function MegaSwingTimeline() {
	const { resolver, openObject } = useMegaSwingObjectContext();
	const scenes = resolver.listObjectsByKind( 'scene' ).sort( ( a, b ) => sceneOrder( a.title ) - sceneOrder( b.title ) );
	return (
		<section className="ms360-view">
			<style>{ viewCss }</style>
			<header className="ms360-view__head"><div><h3>12 Scene Timeline</h3><p>원고 순서의 전체 Scene을 카드 흐름으로 보고 바로 Scene Object로 이동합니다.</p></div><span className="ms360-view__badge">{ scenes.length } SCENES</span></header>
			<div className="ms360-timeline">
				{ scenes.map( ( scene ) => <button type="button" className="ms360-timeline__scene" key={ scene.id } onClick={ () => openObject( scene.id ) }><strong>{ scene.glyph }</strong><b>{ scene.title.replace( /^\d+\s*/, '' ) }</b><small>{ scene.summary }</small></button> ) }
			</div>
		</section>
	);
}

export function MegaSwingMatrix() {
	const { resolver, openObject } = useMegaSwingObjectContext();
	const characters = resolver.listObjectsByKind( 'character' ).slice( 0, 10 );
	const themes = resolver.listObjectsByKind( 'theme' ).slice( 0, 10 );
	return (
		<section className="ms360-view">
			<style>{ viewCss }</style>
			<header className="ms360-view__head"><div><h3>10 Characters × 10 Themes</h3><p>같은 원본 Object를 피벗한 Matrix입니다. 행/열 제목을 누르면 해당 카드로 이동합니다.</p></div><span className="ms360-view__badge">{ characters.length } × { themes.length }</span></header>
			<div className="ms360-matrixScroll">
				<table className="ms360-matrix">
					<thead><tr><th>Character</th>{ themes.map( ( theme ) => <th key={ theme.id }><button type="button" onClick={ () => openObject( theme.id ) }>{ theme.title }</button></th> ) }</tr></thead>
					<tbody>
						{ characters.map( ( character ) => <tr key={ character.id }><td><button type="button" onClick={ () => openObject( character.id ) }>{ character.glyph } { character.title }</button></td>{ themes.map( ( theme ) => {
							const metric = character.themes.find( ( item ) => item.label.toLocaleLowerCase() === theme.title.toLocaleLowerCase() );
							const answerCount = character.qa.filter( ( item ) => item.question.includes( theme.title ) ).length;
							const value = metric?.value ?? answerCount;
							return <td key={ `${ character.id }-${ theme.id }` }><button type="button" className={ `ms360-matrix__cell ${ value > 0 ? 'is-hit' : '' }` } onClick={ () => openObject( character.id ) } title={ `${ character.title } × ${ theme.title }` }>{ value > 0 ? value : '·' }</button></td>;
						} ) }</tr> ) }
					</tbody>
				</table>
			</div>
			<div className="ms360-matrix__legend"><span>숫자 = 현재 resolver에서 연결된 Theme 강도/Answer 수</span><span>· = 연결 데이터 없음</span></div>
		</section>
	);
}
