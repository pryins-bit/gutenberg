import '@wordpress/blocks';

declare module '@wordpress/blocks' {
	export type BlockInstance<
		Attributes extends Record< string, unknown > = Record< string, unknown >,
	> = Block< Attributes >;
}
