export default class IdRegister
{
	static __IdStore = [];

	static containsId( Id )
	{
		return -1 !== IdRegister.__IdStore.indexOf( Id );
	}

	static addId( Id )
	{
		if ( false === IdRegister.containsId( Id ) )
		{
			IdRegister.__IdStore.push( Id );
			return true;
		}
		else
		{
			return false;
		}
	}
}
