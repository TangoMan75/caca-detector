function articleTemplate(data) {
    if (!data || Object.values(data).length === 0) return '';
    return `<article>${Object.values(data).map(tableTemplate).join('')}</article>`;
}

function tableTemplate(items) {
    if (!items || Object.values(items).length === 0) return '';
    const title = Object.values(items)[0].url;
    const time = Object.values(items)[0].timestamp;
    return `
    <div class="overflow-auto">
        <table>
            <thead>
                <tr>
                <th><small>${time}</small></th>
                <th><a href="${title}" target="_blank" rel="noopener noreferrer nofollow">${title}</a></th>
                </tr>
            </thead>
            <thead>
                <tr>
                    <th>Line</th>  
                    <th>Content</th>
                </tr>
            </thead>
            <tbody>
                ${tableRowTemplate(Object.values(items))}
            </tbody>
        </table>
    </div>
    `;
}

function tableRowTemplate(items) {
    return items.map((value) => {
        return `
        <tr>
            <td>${value.index}</td>
            <td>${value.content}</td>
        </tr>
        `
    }).join('');
}

export { articleTemplate }