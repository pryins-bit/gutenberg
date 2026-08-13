import { useState } from '@wordpress/element';
import { megaSwingResolver } from './megaswing-resolver';
import { SiYuanMegaSwingCatalogLoader } from './megaswing-siyuan-adapter';

export function MegaSwingSourcePanel( {
	onCatalogChange,
}: {
	onCatalogChange: ( firstObjectId: string ) => void;
} ) {
	const [ open, setOpen ] = useState( false );
	const [ baseUrl, setBaseUrl ] = useState( 'http://127.0.0.1:6806' );
	const [ project, setProject ] = useState( '철도 전망 호텔' );
	const [ token, setToken ] = useState( '' );
	const [ includeBody, setIncludeBody ] = useState( false );
	const [ busy, setBusy ] = useState( false );
	const [ status, setStatus ] = useState( '샘플 카탈로그' );

	const connect = async () => {
		setBusy( true );
		setStatus( 'SiYuan 객체 읽는 중…' );
		try {
			const loader = new SiYuanMegaSwingCatalogLoader( {
				baseUrl,
				project,
				token,
				includeBody,
			} );
			const objects = await loader.load();
			if ( objects.length === 0 ) {
				throw new Error( 'custom-ms-* 객체를 찾지 못했습니다.' );
			}
			megaSwingResolver.replaceObjects( objects );
			setStatus( `SiYuan 연결 · ${ objects.length } objects` );
			onCatalogChange( objects[ 0 ].id );
			setOpen( false );
		} catch ( error ) {
			setStatus( error instanceof Error ? error.message : 'SiYuan 연결 실패' );
		} finally {
			setBusy( false );
		}
	};

	const useSample = () => {
		megaSwingResolver.resetToSampleCatalog();
		const first = megaSwingResolver.listObjects()[ 0 ];
		setStatus( '샘플 카탈로그' );
		if ( first ) onCatalogChange( first.id );
	};

	return (
		<div className="ms360-source">
			<div className="ms360-source__bar">
				<span><b>DATA SOURCE</b><small>{ status }</small></span>
				<button type="button" onClick={ () => setOpen( ( value ) => ! value ) }>◎ SiYuan 연결</button>
				<button type="button" onClick={ useSample }>샘플</button>
			</div>
			{ open && (
				<div className="ms360-source__panel">
					<label><span>Kernel URL</span><input value={ baseUrl } onChange={ ( event ) => setBaseUrl( event.target.value ) } /></label>
					<label><span>Project</span><input value={ project } onChange={ ( event ) => setProject( event.target.value ) } /></label>
					<label><span>API Token · 현재 세션만 사용</span><input type="password" value={ token } onChange={ ( event ) => setToken( event.target.value ) } autoComplete="off" /></label>
					<label className="ms360-source__check"><input type="checkbox" checked={ includeBody } onChange={ ( event ) => setIncludeBody( event.target.checked ) } /><span>Scene / Answer 본문까지 불러오기</span></label>
					<div className="ms360-source__notice">토큰은 코드·GitHub·브라우저 저장소에 기록하지 않습니다. HTTPS Vercel 프리뷰에서는 로컬 HTTP SiYuan 연결이 브라우저 보안 정책으로 막힐 수 있으므로, 실제 연결은 로컬 Gutenberg/데스크톱 런타임에서 사용합니다.</div>
					<button type="button" className="ms360-source__connect" disabled={ busy } onClick={ connect }>{ busy ? '연결 중…' : 'SiYuan Object Catalog 불러오기' }</button>
				</div>
			) }
			<style>{ `
.ms360-source{border-bottom:1px solid var(--ms-border);background:var(--ms-panel)}.ms360-source__bar{display:flex;align-items:center;gap:6px;padding:7px 12px}.ms360-source__bar>span{display:flex;flex-direction:column;min-width:0;margin-right:auto}.ms360-source__bar b{font-size:9px;letter-spacing:.08em}.ms360-source__bar small{font-size:9px;color:var(--ms-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms360-source button{border:1px solid var(--ms-border);border-radius:8px;background:var(--ms-card);color:inherit;padding:6px 8px;cursor:pointer;font-size:10px}.ms360-source__panel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:10px 12px 12px;border-top:1px solid var(--ms-border)}.ms360-source__panel label{display:flex;flex-direction:column;gap:4px;font-size:9px;color:var(--ms-muted)}.ms360-source__panel input:not([type="checkbox"]){width:100%;min-width:0;border:1px solid var(--ms-border);border-radius:8px;background:var(--ms-card);color:inherit;padding:7px 8px}.ms360-source__check{grid-column:1/-1;flex-direction:row!important;align-items:center}.ms360-source__notice{grid-column:1/-1;color:var(--ms-muted);font-size:9px;line-height:1.5}.ms360-source__connect{grid-column:1/-1;background:var(--ms-accent)!important;color:white!important;border-color:var(--ms-accent)!important}@media(max-width:800px){.ms360-source__panel{grid-template-columns:1fr}}
` }</style>
		</div>
	);
}
