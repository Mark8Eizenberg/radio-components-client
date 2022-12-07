import { useState, useEffect, useRef } from 'react';
import './SliderRange.css';

export default function SliderRange({min, max, minId, maxId, onChange}){
    const [_min, setMin] = useState(min);
    const [_max, setMax] = useState(max);

    const minRangeInput = useRef(null);
    const maxRangeInput = useRef(null);

    useEffect(()=>{
        onChange({min: _min, max: _max})
    },[_min, _max, onChange])

    return <>
        <div className="--slider-container">
            <div className='--min-range-container'>
                <p className='--slider-label'>Min:</p>
                <p className='--slider-label'>{_min}</p>
                <input type={"range"}
                    id={minId}
                    min={min}
                    max={max}
                    defaultValue={min}
                    ref={minRangeInput}
                    onChange={(event)=>{
                        const newMinVal = Number(event.target.value);
                        if(newMinVal >= _max && minRangeInput.current){
                            minRangeInput.current.value = _min;
                        } else {
                            setMin(newMinVal);
                        }
                    }}
                    className="--slider-input"></input>
            </div>
            <div className='--max-range-container'>
                <p className='--slider-label'>Max:</p>
                <p className='--slider-label'>{_max}</p>
                <input type={"range"}
                    ref={maxRangeInput}
                    id={maxId}
                    min={min}
                    max={max}
                    defaultValue={max}
                    onChange={(event)=>{
                        const newMaxVal = Number(event.target.value);
                        if(newMaxVal <= _min && maxRangeInput.current){
                            maxRangeInput.current.value = _max;
                        } else {
                            setMax(newMaxVal);
                        }
                    }}
                    className="--slider-input"></input>
            </div>
        </div>
    </>
}