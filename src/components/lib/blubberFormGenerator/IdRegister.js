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
}
