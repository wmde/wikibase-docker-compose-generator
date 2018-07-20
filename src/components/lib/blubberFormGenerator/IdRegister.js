import ObjectHelper from '../ObjectHelper';

export default class IdRegister
{
	__IdStore = [];

	containsId( Id )
	{
		return -1 !== this.__IdStore.indexOf( Id );
	}

	addId( Id )
	{
		if ( false === this.containsId( Id ) )
		{
			this.__IdStore.push( Id );
			return true;
		}
		else
		{
			return false;
		}
	}

	remove( Item )
	{
		const Index = this.__IdStore.indexOf( Item );
		if ( -1 === Index )
		{
			return;
		}

		this.__IdStore.splice( Index, 1 );
	}

	removeItems( Items )
	{
		let Index;
		for ( Index in Items )
		{
			this.remove( Items[ Index ] );
		}
	}

	intersection( Items )
	{
		return this.__IdStore.filter( Value => Items.indexOf( Value ) );
	}

	getStore()
	{
		return ObjectHelper.copyObj( this.__IdStore );
	}
}
