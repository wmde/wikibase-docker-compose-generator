import { mount } from '@vue/test-utils';
import App from '@/App';

describe( 'App.vue', () =>
{
	it( 'renders', () =>
	{
		expect( mount( App ).find( 'div' ).element ).toBeTruthy();
	} );
} );
