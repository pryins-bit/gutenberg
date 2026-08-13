import assert from 'node:assert/strict';
import test from 'node:test';
import {
	SiYuanKernelClient,
	SiYuanMegaSwingCatalogLoader,
} from './megaswing-siyuan-adapter';

const response = <T>( data: T ) => new Response( JSON.stringify( { code: 0, data } ), {
	status: 200,
	headers: { 'Content-Type': 'application/json' },
} );

const rows = [
	{
		id: 'project-1',
		content: '철도 전망 호텔',
		ial: '{: custom-ms-kind="project"}',
	},
	{
		id: 'char-yukio',
		content: '유기오',
		ial: '{: custom-ms-kind="character" custom-ms-project="철도 전망 호텔" custom-ms-role="주인공" custom-ms-desire="세계 구조를 이해한다"}',
	},
	{
		id: 'theme-pain',
		content: '고통',
		ial: '{: custom-ms-kind="theme" custom-ms-project="철도 전망 호텔" custom-ms-core-question="고통은 존재하는가"}',
	},
	{
		id: 'question-1',
		content: '고통은 존재하는가',
		ial: '{: custom-ms-kind="question" custom-ms-project="철도 전망 호텔" custom-ms-question-theme="고통"}',
	},
	{
		id: 'scene-1',
		content: '호텔의 진동',
		ial: '{: custom-ms-kind="scene" custom-ms-project="철도 전망 호텔" custom-ms-order="1" custom-ms-pov="유기오" custom-ms-themes="고통,인식" custom-ms-motifs="철도 진동,종이컵" custom-ms-questions="고통은 존재하는가" custom-ms-location="철도 전망 호텔" custom-ms-scene-goal="진동을 최초 설치"}',
	},
	{
		id: 'answer-1',
		content: 'Q1 × 유기오',
		ial: '{: custom-ms-kind="answer" custom-ms-project="철도 전망 호텔" custom-ms-answer-character="유기오" custom-ms-answer-question="고통은 존재하는가" custom-ms-answer-theme="고통" custom-ms-answer-text="모른다. 하지만 존재한다는 사실 자체는 자각 가능하다."}',
	},
];

test( 'SiYuan adapter maps canonical docs into connected MegaSwing objects', async () => {
	const calls: Array<{ url: string; init?: RequestInit }> = [];
	const fetchImpl = async ( input: RequestInfo | URL, init?: RequestInit ) => {
		calls.push( { url: String( input ), init } );
		return response( rows );
	};
	const loader = new SiYuanMegaSwingCatalogLoader( {
		baseUrl: 'http://127.0.0.1:6806',
		token: 'secret-for-test',
		fetchImpl: fetchImpl as typeof fetch,
	} );

	const objects = await loader.load();
	const yukio = objects.find( ( object ) => object.id === 'char-yukio' );
	const pain = objects.find( ( object ) => object.id === 'theme-pain' );
	const answer = objects.find( ( object ) => object.id === 'answer-1' );

	assert.ok( yukio );
	assert.equal( yukio.kind, 'character' );
	assert.deepEqual( yukio.scenes.map( ( scene ) => scene.id ), [ 'scene-1' ] );
	assert.equal( yukio.identity.find( ( row ) => row.label === '역할' )?.value, '주인공' );

	assert.ok( pain );
	assert.deepEqual( pain.scenes.map( ( scene ) => scene.id ), [ 'scene-1' ] );

	assert.ok( answer );
	assert.equal( answer.qa[ 0 ]?.question, '고통은 존재하는가' );
	assert.match( answer.qa[ 0 ]?.answer || '', /자각 가능/ );

	assert.equal( calls.length, 1 );
	assert.equal( new Headers( calls[ 0 ].init?.headers ).get( 'Authorization' ), 'Token secret-for-test' );
} );

test( 'SiYuan Kernel client surfaces API errors', async () => {
	const client = new SiYuanKernelClient( {
		fetchImpl: ( async () => new Response( JSON.stringify( { code: -1, msg: 'bad token', data: null } ), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		} ) ) as typeof fetch,
	} );

	await assert.rejects( () => client.query( 'SELECT 1' ), /bad token/ );
} );
