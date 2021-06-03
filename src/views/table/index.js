import {Button, Form, message, Select, Table} from 'antd'
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import './index.css'
import {FormItem} from "@formily/antd";

function TableView(){
    const [schema, setSchema] = useState([]);
    const [showLoading, setShowLoading] = useState(false);

    const [dataColumns, setDataColumns] = useState(schema);
    const [tableRows, setTableRows] = useState([]);
    const [tableName, setTableName] = useState('');

    const [tables, setTables] = useState([]);

    useEffect(() => {

        fetchTables();

        setDataColumns(schema.map(item => item.Field));

        if (schema.length) {
            axios.get('/rows', {
                params: {
                    table: tableName
                }
            }).then(data => {
                console.log(data);
                setTableRows(data);
            });
        }

    }, [schema, tableName]);

    const columns = [
        {title: 'Field', dataIndex: 'Field', key: 'Field'},
        {title: 'Key', dataIndex: 'Key', key: 'Field'},
        {title: 'Null', dataIndex: 'Null', key: 'Field'},
        {title: 'Type', dataIndex: 'Type', key: 'Field'},
        {title: 'Extra', dataIndex: 'Extra', key: 'Field'},
    ];

    const fetchTables = () => {
        axios.get('/tables').then(resp => {
            console.log(resp);
            setTables(resp.map(item => {
                return {
                    value: item[Object.keys(item)[0]],
                    label: item[Object.keys(item)[0]]
                };
            }));
        });
    }
    const fetchData = async e => {
        if (!tableName) {
            await message.error("table name must not empty");
            return;
        }
        console.log('fetch data...');
        setShowLoading(true)
        axios.get("/desc-table", {
            params: {
                table: tableName,
            }
        }).then(schema => {
            setSchema(schema);
        }).finally(() => {
            setShowLoading(false);
        });
    }

    const onTableNameChanged = val => {
        setTableName(val);
    };

    return (
        <div>
            <Form layout="inline">
                <FormItem label="表名">
                    <Select options={tables} placeholder="请输入表名" allowClear onSelect={onTableNameChanged}/>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={fetchData}>获取表结构及数据</Button>
                </FormItem>
            </Form>
            <Table dataSource={schema} columns={columns}
                   loading={showLoading}
                   size="small"
                   scroll={{x: true}}
                   rowKey={row => row.Field}/>

            {dataColumns.length ?
                <Table
                    dataSource={tableRows}
                    columns={dataColumns.map(item => {
                        return {title: item, dataIndex: item, key: 'id'}
                    })}
                    rowKey={row => row.id}
                    size="small"
                    bordered/>
                : null
            }

        </div>
    );
}

export default TableView;
