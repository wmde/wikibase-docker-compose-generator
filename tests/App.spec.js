import { mount } from '@vue/test-utils';
import App from '@/App';
/* eslint-disable */
describe( 'App.vue', () =>
{
	it( 'renders', () =>
	{
		expect( mount( App ).find( 'div' ).element ).toBeTruthy();
	} );
} );
