import { useRef, useCallback } from 'react';
import { debounce } from 'lodash';

const useDebounceFetch = (wait = 0, options = {}, fetchFunc = fetch)=>{

	const ref = useRef();

	const cancel = () => ref.current?.abort();

	const debouncedFunc = useCallback(
		debounce(callback=>callback() , wait, options)
		,[]
	)

	const debounceFetch = function(url, options){
		cancel();	// abort previous request immediately
        const newController = new AbortController();    // also reset controller immediately, so caller can call cancel() from outside
        ref.current = newController;
        
		return new Promise(async (resolve, reject)=>{
			debouncedFunc(async ()=>{
				const signal = newController.signal;    // check if caller may have aborted...
				if(signal.aborted) return;
				try {
					const response = await fetchFunc(url, {...options, signal});
					resolve(response);
				} catch (err) {
					err.code !== 20 && reject(err); //if errorcode 20 (aborted), swallow error
				}
			})
		});
	}

	debounceFetch.cancel = cancel;	//expose so caller can cancel from outside....

	return debounceFetch;
}

export default useDebounceFetch;