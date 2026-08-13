import { registerBlockCollection } from '@wordpress/blocks';
import { registerMegaSwingBlocks } from './megaswing-blocks';
import { registerMegaSwingObjectEmbedBlock } from './megaswing-object-embed';

let registered = false;

export function registerMegaSwingEnvironment() {
	if ( registered ) return;

	registerBlockCollection( 'megaswing', {
		title: 'MegaSwing 360',
		icon: 'screenoptions',
	} );
	registerMegaSwingBlocks();
	registerMegaSwingObjectEmbedBlock();
	registered = true;
}
