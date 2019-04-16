
export const root = '';

export const timestampToTime = timestamp => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D+h+m+s;
};



export const loadName = (name,tableData) => {
    for (let i = 0; i < tableData.length; i++) {
        name.push({"value" : tableData[i].WebName});
    }
};

//检索名字是否存在
export const createFilter = queryString => {
    return (webName) => {
        return (webName.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
};

export const errorSearch = (bufferData,tableData,page,first_time,last_time) => {
    let n = tableData.length;
    //bufferData = [];
    for (let i = 0; i < n; i++) {
        if (tableData[i].Time > first_time
            && tableData[i].Time < last_time) {
            bufferData.push(tableData[i]);
        }
    }
};

