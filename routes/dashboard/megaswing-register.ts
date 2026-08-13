import { registerBlockCollection } from '@wordpress/blocks';
import { registerMegaSwingBlocks } from './megaswing-blocks';
import { registerMegaSwingObjectEmbedBlock } from './megaswing-object-embed';
import { registerMegaSwingObjectStackBlock } from './megaswing-object-stack';

let registered = false;

export function registerMegaSwingEnvironment() {
	if ( registered ) return;

	registerBlockCollection( 'megaswing', {
		title: 'MegaSwing 360',
		icon: 'screenoptions',
	} );
	registerMegaSwingBlocks();
	registerMegaSwingObjectEmbedBlock();
	registerMegaSwingObjectStackBlock();
	registered = true;
}
