import React from 'react';
import ReactDOM from 'react-dom';
import { generate } from '@bramus/pagination-sequence';

const BASE_URL = '#';

const PaginationEntry = ({ value, onEntryClick = null, label = null, title = null, isCurrent = false, isDisabled = false, ...props }) => {
    label ??= value;
    title ??= `Go to page ${value}`;

    const onClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        e.target.blur();

        if (onEntryClick) {
            onEntryClick(value);
        }
    };

    if (value == '…') {
        return (
            <li data-pagination-ellipsis {...props}>
                <span>{label}</span>
            </li>
        );
    }

    if (isDisabled) {
        return (
            <li data-pagination-disabled {...props}>
                <span>{label}</span>
            </li>
        );
    }

    if (isCurrent) {
        props['data-pagination-current'] = true;
    }

    return (
        <li {...props}>
            <a href={`${BASE_URL}/page/${value}`} title={title} onClick={onClick}>
                {label}
            </a>
        </li>
    );
};

const Pagination = ({ curPage, numPages, sequence, onEntryClick = null, showFirstLastArrows = true, showNextPrevArrows = true }) => {
    return (
        <ul className="pagination">
            {showFirstLastArrows && <PaginationEntry data-pagination-first onEntryClick={onEntryClick} value={1} title="Go to First Page" label="&laquo;" isDisabled={curPage === 1} />}
            {showNextPrevArrows && <PaginationEntry data-pagination-prev onEntryClick={onEntryClick} value={curPage - 1} title="Go to Previous Page" label="&lsaquo;" isDisabled={curPage === 1} />}
            {sequence.map((val, idx) => (
                <PaginationEntry key={`page-${val == '…' ? `…-${idx}` : val}`} onEntryClick={onEntryClick} value={val} isCurrent={val == curPage} />
            ))}
            {showNextPrevArrows && <PaginationEntry data-pagination-next onEntryClick={onEntryClick} value={curPage + 1} title="Go to Next Page" label="&rsaquo;" isDisabled={curPage === numPages} />}
            {showFirstLastArrows && <PaginationEntry data-pagination-next onEntryClick={onEntryClick} value={numPages} title="Go to Last Page" label="&raquo;" isDisabled={curPage === numPages} />}
        </ul>
    );
};

const Demo = () => {
    const [curPage, setCurPage] = React.useState(1);
    const [numPages, setNumPages] = React.useState(50);
    const [numPagesAtEdges, setNumPagesAtEdges] = React.useState(2);
    const [numPagesAroundCurrent, setNumPagesAroundCurrent] = React.useState(2);

    const [showNextPrevArrows, setShowNextPrevArrows] = React.useState(true);
    const [showFirstLastArrows, setShowFirstLastArrows] = React.useState(false);

    const [lastAction, setLastAction] = React.useState('💡 Use the form controls below to tweak the pagination sequence params');
    const [sequence, setSequence] = React.useState([]);

    // When dragging numPages, make sure curPage is capped to it when dragging down
    React.useEffect(() => {
        if (curPage > numPages) {
            setCurPage(numPages);
        }
    }, [numPages]);

    // When dragging curPage up, make sure the range of numPages is extended too
    React.useEffect(() => {
        if (curPage > numPages) {
            setNumPages(curPage);
        }
    }, [curPage]);

    // Click handler
    const handleEntryClick = (value) => {
        setCurPage(value);
        setLastAction(`⚡️ Clicked: Go to Page ${value}`);
    };

    const setValue = (setFunction) => (e) => setFunction(parseInt(e.target.value));
    const toggleChecked = (setFunction, curValue) => (e) => setFunction(!curValue);

    // Generate a sequence when params change
    React.useEffect(() => {
        setSequence(generate(curPage, numPages, numPagesAtEdges, numPagesAroundCurrent));
    }, [curPage, numPages, numPagesAtEdges, numPagesAroundCurrent]);

    return (
        <div>
            <h2>Input Params</h2>
            <form>
                <fieldset>
                    <legend>
                        Tweak <code>@bramus/pagination-sequence</code> params
                    </legend>
                    <label htmlFor="curPage">
                        <code>
                            curPage = <output>{curPage}</output>
                        </code>
                    </label>
                    <input type="range" id="curPage" onInput={setValue(setCurPage)} value={curPage} min={1} max={50} step="1" />

                    <label htmlFor="numPages">
                        <code>
                            numPages = <output>{numPages}</output>
                        </code>
                    </label>
                    <input type="range" id="numPages" onInput={setValue(setNumPages)} value={numPages} min={1} max={50} step="1" />

                    <label htmlFor="numPagesAtEdges">
                        <code>
                            numPagesAtEdges = <output>{numPagesAtEdges}</output>
                        </code>
                    </label>
                    <input type="range" id="numPagesAtEdges" onInput={setValue(setNumPagesAtEdges)} defaultValue={numPagesAtEdges} min={0} max={3} step="1" />

                    <label htmlFor="numPagesAroundCurrent">
                        <code>
                            numPagesAroundCurrent = <output>{numPagesAroundCurrent}</output>
                        </code>
                    </label>
                    <input type="range" id="numPagesAroundCurrent" onInput={setValue(setNumPagesAroundCurrent)} defaultValue={numPagesAroundCurrent} min={0} max={3} step="1" />
                </fieldset>
            </form>

            <h2>
                Raw <code>@bramus/pagination-sequence</code> Output
            </h2>
            <p>
                <code>
                    <output>[{sequence.join(',')}]</output>
                </code>
            </p>

            <h2>Rendered with Component</h2>
            <Pagination
                {...{
                    curPage,
                    numPages,
                    sequence,
                    onEntryClick: handleEntryClick,
                    showFirstLastArrows,
                    showNextPrevArrows,
                }}
            />

            <h2>Component Configuration</h2>
            <form>
                <fieldset>
                    <legend>Tweak Component Appearance</legend>

                    <label htmlFor="showNextPrevArrows">
                        <code>showNextPrevArrows</code>
                    </label>
                    <input type="checkbox" id="showNextPrevArrows" onInput={toggleChecked(setShowNextPrevArrows, showNextPrevArrows)} checked={showNextPrevArrows} />

                    <label htmlFor="showFirstLastArrows">
                        <code>showFirstLastArrows</code>
                    </label>
                    <input type="checkbox" id="showFirstLastArrows" onInput={toggleChecked(setShowFirstLastArrows, showFirstLastArrows)} checked={showFirstLastArrows} />
                </fieldset>
            </form>
        </div>
    );
};

ReactDOM.render(<Demo />, document.getElementById('root'));
