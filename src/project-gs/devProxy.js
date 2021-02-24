module.exports = [
    {
        url: '/guoshou/claim/**',
        targetUrl: 'http://10.9.43.140:8089/',
        //targetUrl: 'http://localhost:8089/',
        timeout: 600000
    },
    {
        url: '/images/**',
        targetUrl: 'http://172.21.136.12:17665',
        timeout: 600000
    }
]
