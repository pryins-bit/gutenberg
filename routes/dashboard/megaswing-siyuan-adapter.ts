import type {
	MegaSwingResolvedObject,
	MegaSwingUniversalKind,
} from './megaswing-universal';

type SiYuanApiResponse<T> = {
	code: number;
	msg?: string;
	data: T;
};

type SiYuanBlockRow = {
	id: string;
	content: string;
	ial?: string;
};

type SiYuanEntity = {
	id: string;
	title: string;
	kind: MegaSwingUniversalKind;
	attrs: Record<string, string>;
};

export type SiYuanMegaSwingConnection = {
	/** SiYuan Kernel base URL. Desktop default is commonly local loopback. */
	baseUrl?: string;
	/** API token. Never persist this value in repository source. */
	token?: string;
	/** Optional project title or block id used to narrow the returned catalog. */
	project?: string;
	/** Include document Kramdown for Scene / Answer objects. Off by default for speed. */
	includeBody?: boolean;
	/** Optional fetch implementation for Electron/tests. */
	fetchImpl?: typeof fetch;
};

const ATTR = {
	kind: 'custom-ms-kind',
	project: 'custom-ms-project',
	order: 'custom-ms-order',
	part: 'custom-ms-part',
	chapter: 'custom-ms-chapter',
	pov: 'custom-ms-pov',
	themes: 'custom-ms-themes',
	motifs: 'custom-ms-motifs',
	questions: 'custom-ms-questions',
	storyTime: 'custom-ms-story-time',
	status: 'custom-ms-status',
	revisionPass: 'custom-ms-revision-pass',
	sceneGoal: 'custom-ms-scene-goal',
	required: 'custom-ms-required',
	forbidden: 'custom-ms-forbidden',
	endCondition: 'custom-ms-end-condition',
	weaveStages: 'custom-ms-weave-stages',
	reveals: 'custom-ms-reveals',
	characters: 'custom-ms-characters',
	location: 'custom-ms-location',
	situations: 'custom-ms-situations',
	techniques: 'custom-ms-techniques',
	role: 'custom-ms-role',
	desire: 'custom-ms-desire',
	lack: 'custom-ms-lack',
	fear: 'custom-ms-fear',
	themePosition: 'custom-ms-theme-position',
	knownFacts: 'custom-ms-known-facts',
	coreQuestion: 'custom-ms-core-question',
	opposite: 'custom-ms-opposite',
	resolution: 'custom-ms-resolution',
	symbolMeaning: 'custom-ms-symbol-meaning',
	lifecycle: 'custom-ms-lifecycle',
	questionTheme: 'custom-ms-question-theme',
	questionAxis: 'custom-ms-question-axis',
	answerCharacter: 'custom-ms-answer-character',
	answerQuestion: 'custom-ms-answer-question',
	answerTheme: 'custom-ms-answer-theme',
	answerText: 'custom-ms-answer-text',
	knownBy: 'custom-ms-known-by',
} as const;

const SUPPORTED_KINDS = new Set<MegaSwingUniversalKind>( [
	'project', 'character', 'scene', 'theme', 'question', 'answer', 'fact', 'motif',
	'material', 'location', 'time', 'situation', 'technique',
] );

const glyphByKind: Record<MegaSwingUniversalKind, string> = {
	project: '▣',
	character: '人',
	scene: 'S',
	theme: '◇',
	question: '?',
	answer: '答',
	fact: '◆',
	motif: '≈',
	material: '物',
	location: '⌖',
	time: '⌚',
	situation: '!',
	technique: '✎',
};

const split = ( value = '' ) =>
	value.split( /[,，|\n]/ ).map( ( item ) => item.trim() ).filter( Boolean );

const parseIAL = ( ial = '' ) => {
	const attrs: Record<string, string> = {};
	const regexp = /([\w-]+)="([^"]*)"/g;
	let match: RegExpExecArray | null;
	while ( ( match = regexp.exec( ial ) ) !== null ) {
		attrs[ match[ 1 ] ] = match[ 2 ];
	}
	return attrs;
};

const parseStages = ( value = '' ) =>
	value
		.split( /[|\n]/ )
		.map( ( item ) => item.trim() )
		.filter( Boolean )
		.map( ( item ) => {
			const index = item.indexOf( ':' );
			return index > 0
				? { label: item.slice( 0, index ).trim(), stage: item.slice( index + 1 ).trim() }
				: { label: item, stage: '' };
		} );

const asKind = ( value: string | undefined ) => {
	if ( ! value ) return;
	const kind = value as MegaSwingUniversalKind;
	return SUPPORTED_KINDS.has( kind ) ? kind : undefined;
};

const normalize = ( value: string ) => value.trim().toLocaleLowerCase();

export class SiYuanKernelClient {
	private readonly baseUrl: string;
	private readonly token: string;
	private readonly fetchImpl: typeof fetch;

	constructor( connection: SiYuanMegaSwingConnection = {} ) {
		this.baseUrl = ( connection.baseUrl || 'http://127.0.0.1:6806' ).replace( /\/$/, '' );
		this.token = connection.token?.trim() || '';
		this.fetchImpl = connection.fetchImpl || fetch;
	}

	async post<T>( path: string, payload: Record<string, unknown> ): Promise<T> {
		const headers: Record<string, string> = { 'Content-Type': 'application/json' };
		if ( this.token ) {
			headers.Authorization = this.token.startsWith( 'Token ' ) ? this.token : `Token ${ this.token }`;
		}
		const response = await this.fetchImpl( `${ this.baseUrl }${ path }`, {
			method: 'POST',
			headers,
			body: JSON.stringify( payload ),
		} );
		if ( ! response.ok ) {
			throw new Error( `SiYuan API ${ path } failed with HTTP ${ response.status }` );
		}
		const result = await response.json() as SiYuanApiResponse<T>;
		if ( result.code !== 0 ) {
			throw new Error( result.msg || `SiYuan API ${ path } returned code ${ result.code }` );
		}
		return result.data;
	}

	query<T extends Record<string, unknown> = Record<string, unknown>>( stmt: string ) {
		return this.post<T[]>( '/api/query/sql', { stmt } );
	}

	getBlockKramdown( id: string ) {
		return this.post<{ kramdown?: string } | string>( '/api/block/getBlockKramdown', { id } );
	}
}

export class SiYuanMegaSwingCatalogLoader {
	private readonly client: SiYuanKernelClient;
	private readonly project: string;
	private readonly includeBody: boolean;

	constructor( connection: SiYuanMegaSwingConnection = {} ) {
		this.client = new SiYuanKernelClient( connection );
		this.project = connection.project?.trim() || '';
		this.includeBody = Boolean( connection.includeBody );
	}

	async load(): Promise<MegaSwingResolvedObject[]> {
		const rows = await this.client.query<SiYuanBlockRow>(
			"SELECT id, content, ial FROM blocks WHERE type='d' AND ial LIKE '%custom-ms-kind=%' ORDER BY updated DESC LIMIT 5000"
		);
		const entities = rows
			.map( ( row ) => {
				const attrs = parseIAL( row.ial || '' );
				const kind = asKind( attrs[ ATTR.kind ] );
				if ( ! kind ) return;
				return {
					id: row.id,
					title: row.content || '제목 없음',
					kind,
					attrs,
				} satisfies SiYuanEntity;
			} )
			.filter( ( entity ): entity is SiYuanEntity => Boolean( entity ) );

		const projectEntities = this.filterProject( entities );
		const objects = projectEntities.map( ( entity ) => this.toObject( entity, projectEntities ) );
		if ( this.includeBody ) {
			await this.hydrateBodies( objects );
		}
		return objects;
	}

	private filterProject( entities: SiYuanEntity[] ) {
		if ( ! this.project ) return entities;
		const projectKey = normalize( this.project );
		return entities.filter( ( entity ) => {
			if ( entity.kind === 'project' ) {
				return normalize( entity.id ) === projectKey || normalize( entity.title ) === projectKey;
			}
			const value = normalize( entity.attrs[ ATTR.project ] || '' );
			return ! value || value === projectKey;
		} );
	}

	private toObject( entity: SiYuanEntity, all: SiYuanEntity[] ): MegaSwingResolvedObject {
		const attrs = entity.attrs;
		const relatedScenes = this.relatedScenes( entity, all );
		const relatedThemes = this.relatedThemeNames( entity );
		const relations = this.relations( entity );
		const identity = this.identity( entity );
		const motifs = entity.kind === 'scene'
			? parseStages( attrs[ ATTR.weaveStages ] ).map( ( item ) => ( {
				label: item.label,
				steps: [ { label: item.stage || '연결', state: 'on' as const } ],
			} ) )
			: entity.kind === 'material' || entity.kind === 'motif'
				? [ { label: entity.title, steps: split( attrs[ ATTR.lifecycle ] ).map( ( label ) => ( { label, state: 'on' as const } ) ) } ]
				: [];

		return {
			id: entity.id,
			kind: entity.kind,
			title: entity.title,
			glyph: entity.kind === 'scene' && attrs[ ATTR.order ] ? attrs[ ATTR.order ].padStart( 2, '0' ) : glyphByKind[ entity.kind ],
			meta: this.meta( entity ),
			summary: this.summary( entity ),
			identity,
			scenes: relatedScenes.map( ( scene ) => ( {
				id: scene.id,
				order: scene.attrs[ ATTR.order ] || '',
				title: scene.title,
				role: scene.attrs[ ATTR.sceneGoal ] || undefined,
			} ) ),
			situations: entity.kind === 'scene' ? split( attrs[ ATTR.situations ] ) : [],
			themes: relatedThemes.map( ( label, index ) => ( { label, value: Math.max( 1, 8 - index ), max: 8 } ) ),
			knowledge: entity.kind === 'fact'
				? split( attrs[ ATTR.knownBy ] ).map( ( label ) => ( { label, known: true } ) )
				: split( attrs[ ATTR.knownFacts ] ).map( ( label ) => ( { label, known: true } ) ),
			qa: entity.kind === 'answer'
				? [ { question: attrs[ ATTR.answerQuestion ] || 'Answer', answer: attrs[ ATTR.answerText ] || '' } ]
				: [],
			motifs,
			relations,
			locations: entity.kind === 'scene' ? split( attrs[ ATTR.location ] ) : [],
			symbols: entity.kind === 'scene' ? split( attrs[ ATTR.motifs ] ) : [],
			manuscript: entity.kind === 'answer' ? attrs[ ATTR.answerText ] || '' : '',
		};
	}

	private relatedScenes( entity: SiYuanEntity, all: SiYuanEntity[] ) {
		const scenes = all.filter( ( candidate ) => candidate.kind === 'scene' );
		if ( entity.kind === 'scene' ) return [ entity ];
		return scenes.filter( ( scene ) => {
			const attrs = scene.attrs;
			const title = normalize( entity.title );
			switch ( entity.kind ) {
				case 'project':
					return [ normalize( entity.id ), title ].includes( normalize( attrs[ ATTR.project ] || '' ) );
				case 'character':
					return normalize( attrs[ ATTR.pov ] || '' ) === title || split( attrs[ ATTR.characters ] ).some( ( item ) => normalize( item ) === title );
				case 'theme':
					return split( attrs[ ATTR.themes ] ).some( ( item ) => normalize( item ) === title );
				case 'material':
				case 'motif':
					return split( attrs[ ATTR.motifs ] ).some( ( item ) => normalize( item ) === title ) || parseStages( attrs[ ATTR.weaveStages ] ).some( ( item ) => normalize( item.label ) === title );
				case 'question':
					return split( attrs[ ATTR.questions ] ).some( ( item ) => normalize( item ) === title );
				case 'fact':
					return split( attrs[ ATTR.reveals ] ).some( ( item ) => normalize( item ) === title );
				case 'location':
					return split( attrs[ ATTR.location ] ).some( ( item ) => normalize( item ) === title );
				case 'situation':
					return split( attrs[ ATTR.situations ] ).some( ( item ) => normalize( item ) === title );
				case 'technique':
					return split( attrs[ ATTR.techniques ] ).some( ( item ) => normalize( item ) === title );
				default:
					return false;
			}
		} ).sort( ( a, b ) => Number( a.attrs[ ATTR.order ] || 9999 ) - Number( b.attrs[ ATTR.order ] || 9999 ) );
	}

	private relatedThemeNames( entity: SiYuanEntity ) {
		if ( entity.kind === 'theme' ) return [ entity.title ];
		if ( entity.kind === 'scene' ) return split( entity.attrs[ ATTR.themes ] );
		if ( entity.kind === 'answer' ) return split( entity.attrs[ ATTR.answerTheme ] );
		if ( entity.kind === 'question' ) return split( entity.attrs[ ATTR.questionTheme ] );
		return [];
	}

	private relations( entity: SiYuanEntity ) {
		const a = entity.attrs;
		const values: string[] = [];
		if ( entity.kind === 'scene' ) {
			values.push( a[ ATTR.pov ] || '', ...split( a[ ATTR.characters ] ), ...split( a[ ATTR.themes ] ), ...split( a[ ATTR.motifs ] ), ...split( a[ ATTR.questions ] ), ...split( a[ ATTR.reveals ] ), ...split( a[ ATTR.location ] ), ...split( a[ ATTR.situations ] ) );
		} else if ( entity.kind === 'answer' ) {
			values.push( a[ ATTR.answerCharacter ] || '', a[ ATTR.answerQuestion ] || '', a[ ATTR.answerTheme ] || '' );
		} else if ( entity.kind === 'fact' ) {
			values.push( ...split( a[ ATTR.knownBy ] ) );
		} else if ( entity.kind === 'question' ) {
			values.push( a[ ATTR.questionTheme ] || '' );
		}
		return [ ...new Set( values.map( ( value ) => value.trim() ).filter( Boolean ) ) ];
	}

	private identity( entity: SiYuanEntity ) {
		const a = entity.attrs;
		const rows: Array<{ label: string; value: string }> = [];
		const push = ( label: string, value = '' ) => value && rows.push( { label, value } );
		switch ( entity.kind ) {
			case 'scene':
				push( '원고 순서', a[ ATTR.order ] ); push( '부', a[ ATTR.part ] ); push( '장', a[ ATTR.chapter ] ); push( 'POV', a[ ATTR.pov ] ); push( '사건 시간', a[ ATTR.storyTime ] ); push( '목적', a[ ATTR.sceneGoal ] ); push( '상태', a[ ATTR.status ] ); break;
			case 'character':
				push( '역할', a[ ATTR.role ] ); push( '욕망', a[ ATTR.desire ] ); push( '결핍', a[ ATTR.lack ] ); push( '두려움', a[ ATTR.fear ] ); push( '주제 입장', a[ ATTR.themePosition ] ); break;
			case 'theme':
				push( '중심 질문', a[ ATTR.coreQuestion ] ); push( '반대 명제', a[ ATTR.opposite ] ); push( '잠정 해결', a[ ATTR.resolution ] ); break;
			case 'material':
			case 'motif':
				push( '상징/감각 의미', a[ ATTR.symbolMeaning ] ); push( '수명주기', a[ ATTR.lifecycle ] ); break;
			case 'question':
				push( '주제', a[ ATTR.questionTheme ] ); push( '판단 축', a[ ATTR.questionAxis ] ); break;
			case 'answer':
				push( '인물', a[ ATTR.answerCharacter ] ); push( '질문', a[ ATTR.answerQuestion ] ); push( '주제', a[ ATTR.answerTheme ] ); break;
			case 'fact':
				push( 'Known by', a[ ATTR.knownBy ] ); break;
			default:
				push( '프로젝트', a[ ATTR.project ] );
		}
		return rows;
	}

	private meta( entity: SiYuanEntity ) {
		const a = entity.attrs;
		if ( entity.kind === 'scene' ) {
			return [ a[ ATTR.order ] && `Scene ${ a[ ATTR.order ] }`, a[ ATTR.storyTime ], a[ ATTR.pov ], a[ ATTR.status ] ].filter( Boolean ).join( ' · ' );
		}
		if ( entity.kind === 'answer' ) {
			return [ 'Answer', a[ ATTR.answerCharacter ], a[ ATTR.answerQuestion ], a[ ATTR.answerTheme ] ].filter( Boolean ).join( ' · ' );
		}
		return [ entity.kind, a[ ATTR.project ] ].filter( Boolean ).join( ' · ' );
	}

	private summary( entity: SiYuanEntity ) {
		const a = entity.attrs;
		if ( entity.kind === 'scene' ) return a[ ATTR.sceneGoal ] || `${ entity.title } Scene Object`;
		if ( entity.kind === 'character' ) return [ a[ ATTR.desire ], a[ ATTR.lack ], a[ ATTR.fear ] ].filter( Boolean ).join( ' / ' ) || `${ entity.title } Character Object`;
		if ( entity.kind === 'theme' ) return a[ ATTR.coreQuestion ] || `${ entity.title } Theme Object`;
		if ( entity.kind === 'material' || entity.kind === 'motif' ) return a[ ATTR.symbolMeaning ] || `${ entity.title } Motif Object`;
		return `${ entity.title } ${ entity.kind } Object`;
	}

	private async hydrateBodies( objects: MegaSwingResolvedObject[] ) {
		const candidates = objects.filter( ( object ) => object.kind === 'scene' || object.kind === 'answer' );
		let cursor = 0;
		const worker = async () => {
			while ( cursor < candidates.length ) {
				const object = candidates[ cursor++ ];
				try {
					const response = await this.client.getBlockKramdown( object.id );
					object.manuscript = typeof response === 'string' ? response : response.kramdown || object.manuscript;
					if ( object.kind === 'answer' && object.qa[ 0 ] && object.manuscript ) {
						object.qa[ 0 ].answer = object.manuscript;
					}
				} catch {
					// Metadata catalog remains usable even if one document body cannot be loaded.
				}
			}
		};
		await Promise.all( Array.from( { length: Math.min( 6, candidates.length ) }, () => worker() ) );
	}
}
