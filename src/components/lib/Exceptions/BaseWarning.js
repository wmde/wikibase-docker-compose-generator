export default class BaseWarning
{
	constructor( Message )
	{
        console.warn( Message );// eslint-disable-line
        console.trace();// eslint-disable-line
	}
}
