/*封装数据接收api*/
import axios from 'axios'


let root = '/api/ccsu';

/** carrier **/
export function GetCarrierList(para) {
    return axios.post( root+'/base_table/carrier_get', para).then(res => res.data);
}

export function AddCarrie(para) {
    return axios.post( root+'/base_table/carrier_add', para).then(res => res.data);
}

export function DeleteCarrie(para) {
    return axios.post( root+'/base_table/carrier_delete', para).then(res => res.data);
}

export function UpdateCarrie(para) {
    return axios.post( root+'/base_table/carrier_update', para).then(res => res.data);
}


/** department **/
export function GetDepList(para) {
    return axios.post( root+'/server_manage/department_get', para).then(res => res.data);
}

export function AddDepartment(para) {
    return axios.post( root+'/server_manage/department_add', para).then(res => res.data);
}

export function DeleteDepartment(para) {
    return axios.post( root+'/server_manage/department_delete', para).then(res => res.data);
}

export function UpdateDepartment(para) {
    return axios.post( root+'/server_manage/department_update', para).then(res => res.data);
}


/** manager **/
export function GetManagerList(para) {
    return axios.post( root+'/server_manage/manager_get', para).then(res => res.data);
}

export function AddManager(para) {
    return axios.post( root+'/server_manage/manager_add', para).then(res => res.data);
}

export function DeleteManager(para) {
    return axios.post( root+'/server_manage/manager_delete', para).then(res => res.data);
}

export function UpdateManager(para) {
    return axios.post( root+'/server_manage/manager_update', para).then(res => res.data);
}


/** server **/
export function GetServerList(para) {
    return axios.post( root+'/server_manage/server_get',para).then(res => res.data);
}

export function AddServer(para) {
    return axios.post( root+'/server_manage/server_add', para).then(res => res.data);
}

export function DeleteServer(para) {
    return axios.post( root+'/server_manage/server_delete', para).then(res => res.data);
}

export function UpdateServer(para) {
    return axios.post( root+'/server_manage/server_update', para).then(res => res.data);
}

/** website **/
export function GetWebSiteList(para) {
    return axios.post( root+'/base_table/site_get', para).then(res => res.data);
}

export function AddWebSite(para) {
    return axios.post( root+'/base_table/site_add', para).then(res => res.data);
}

export function DeleteWebSite(para) {
    return axios.post( root+'/base_table/site_delete', para).then(res => res.data);
}

export function UpdateWebSite(para) {
    return axios.post( root+'/base_table/site_update', para).then(res => res.data);
}



