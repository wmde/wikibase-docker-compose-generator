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

	removeId( Id )
	{
		const Index = this.__IdStore.indexOf( Id );
		if ( -1 === Index )
		{
			return;
		}

		this.__IdStore.splice( Index, 1 );
	}

	removeIds( Ids )
	{
		let Index;
		for ( Index in Ids )
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
