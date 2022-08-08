# use-debounce-fetch

A React Hook to debounce fetch requests and abort previous pending requests made by this hook.

## Features
-  Debounce duplicate requests such as when searching
-  Abort pending requests made previously using this hook
-  Swallows error "The user aborted a request" for previously aborted requests
-  Eliminates need for a debounced input

## Install via [npm](https://npmjs.org/)
 
```shell
   npm install use-debounce-fetch
```

## Usage

```javascript
import useDebounceFetch from 'use-debounce-fetch'

export const RepoSearch  = ()=>{

	const debounceFetch = useDebounceFetch(400);
	const [results, setResults] = useState([]);

	const search = async e =>{
		const {value} = e.target;
		if(value){
			const res = await debounceFetch('https://api.github.com/search/repositories?q='+value);
			const data = await res.json();
			setResults(data.items);
		}else{
			debounceFetch.cancel();
			setResults([]);
		}
	}
	
	return (
		<div>
			<input onChange={search}/>
			<h3>Results</h3>
			{results.map((item, index)=>(
				<div key={index}>{item.name}</div>
			))}
		</div>
	);
}
```
## API

### useDebounceFetch( [ wait=0 ], [ options={} ], [ fetchFunc=fetch ])

* **`wait`** `[number=0]` The number of milliseconds to delay.
* **`options`** `[object={}]` Lodash.debounce options object. See [_.debounce](https://lodash.com/docs/#debounce)
* **`fetchFunc`** `[Function=fetch]` The fetch library (function) to use under the hood. Defaults to native fetch. (Needs to reject with errorcode 20 when request is aborted for this hook to swallow those errors)

### Peer dependencies
*	react >=16.8.2