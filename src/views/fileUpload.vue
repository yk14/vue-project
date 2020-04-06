<template>
    <div class="page">
        <div id="filePicker">选择文件</div>
        <div><dx-text-box placeholder="请输入路径" v-model="destPath"></dx-text-box></div>

        <div class="file-panel">
            <h2 style="margin-top: 10px;">文件列表</h2>
            <div class="file-list">
                <ul class="file-item" :class="`file-${file.id}`" v-for="file in fileList">
                    <li class="file-type" :icon="fileCategory(file.ext)"></li>
                    <li class="file-name">{{file.name}}</li>
                    <li class="file-size">{{fileSize(file.size)}}</li>
                    <li class="file-status">上传中...</li>
                    <li class="file-operate">
                        <a title="开始"  @click="resume(file)"><i class="result-icon start-icon"></i></a>
                        <a title="暂停"  @click="stop(file)"><i class="result-icon stop-icon"></i></a>
                        <a title="移除"  @click="remove(file)"><i class="result-icon delete-icon"></i></a>
                    </li>
                    <li class="progress"></li>
                </ul>
                <div class="no-file" v-if="!fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
            </div>
        </div>

        <vue-upload
                :destPath="destPath"
                ref="uploader"
                uploadButton="#filePicker"
                multiple
                @fileChange="fileChange"
                @progress="onProgress"
                @success="onSuccess"
        ></vue-upload>
    </div>
</template>

<script>
    import $ from 'jquery'
    import DxTextBox from 'devextreme-vue/text-box';
    import SparkMD5 from 'spark-md5';
    import WebUploader from 'webUploader'
    import vueUpload from '../views/vueUpload';
    export default {
        name: 'fileUpload',
        data() {
            return {
                fileList: [],
                destPath: 'E:\\TSSWCFServices\\Reporting\\1\\'
            }
        },
        mounted() {
        },
        computed: {
            uploader() {
                return this.$refs.uploader;
            }
        },
        methods: {
            fileChange(file) {
                if (!file.size) return;
                this.fileList.push(file);
            },
            onProgress(file, percent) {
                console.log("T-onProgress",percent)
                $(`.file-${file.id} .progress`).css('width', percent * 100 + '%');
                $(`.file-${file.id} .file-status`).html((percent * 100).toFixed(2) + '%');
            },
            onSuccess (file, response) {
                let _this = this
                console.log('上传成功', response)
                let resBoby = JSON.parse(response)
                let $fileStatus = $(`.file-${file.id} .file-status`)
                if (resBoby.chunked && !resBoby.hasError) {
                    $fileStatus.html('转码中....');
                    let formData = new FormData()
                    formData.append('fileExt', resBoby.f_ext)
                    formData.append('guid',resBoby.guid)
                    formData.append('destPath',_this.destPath)
                    this.$axios.post(window.GlobalVariable.MergeFiles,formData).then(res => {
                        let $fileStatus = $(`.file-${file.id} .file-status`);
                        let d = JSON.parse(res.data)
                        if (!d.hasError) {
                            $fileStatus.html('上传成功');
                        } else {
                            $fileStatus.html('上传失败');
                        }
                    });
                }else {
                    if (!resBoby.hasError) {
                        $fileStatus.html('上传成功');
                    } else {
                        $fileStatus.html('上传失败');
                    }
                }
            },
            resume(file) {
                this.uploader.upload(file);
            },
            stop(file) {
                this.uploader.stop(file);
            },
            remove(file) {
                // 取消并中断文件上传
                this.uploader.cancelFile(file);
                // 在队列中移除文件
                this.uploader.removeFile(file, true);
                // 在ui上移除
                let index = this.fileList.findIndex(ele => ele.id === file.id);
                this.fileList.splice(index, 1);
            },
            fileSize(size) {
                return WebUploader.Base.formatSize(size);
            },
            fileCategory(ext) {
                let type = '';
                const typeMap = {
                    image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
                    video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
                    text: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
                };
                Object.keys(typeMap).forEach((_type) => {
                    const extensions = typeMap[_type];
                    if (extensions.indexOf(ext) > -1) {
                        type = _type
                    }
                });
                return type
            },
            /**
             * 计算md5，实现断点续传及秒传
             * 暂未使用
             * @param file
             */
            computeMD5(file) {
                let fileReader = new FileReader();
                let time = new Date().getTime();
                let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                let currentChunk = 0;
                const chunkSize = 10 * 1024 * 1000;
                let chunks = Math.ceil(file.size / chunkSize);
                let spark = new SparkMD5.ArrayBuffer();

                // 文件状态设为"计算MD5"
                this.statusSet(file.id, 'md5');
                file.pause();

                loadNext();

                fileReader.onload = (e => {
                    spark.append(e.target.result);

                    if (currentChunk < chunks) {
                        currentChunk++;
                        loadNext();

                        // 实时展示MD5的计算进度
                        this.$nextTick(() => {
                            $(`.myStatus_${file.id}`).text('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
                        })
                    } else {
                        let md5 = spark.end();
                        this.computeMD5Success(md5, file);
                        console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
                    }
                });

                fileReader.onerror = function () {
                    this.error(`文件${file.name}读取出错，请检查该文件`)
                    file.cancel();
                };

                function loadNext() {
                    let start = currentChunk * chunkSize;
                    let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

                    fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
                }
            },
            computeMD5Success(md5, file) {
                // 将自定义参数直接加载uploader实例的opts上
                Object.assign(this.uploader.opts, {
                    query: {
                        ...this.params,
                    }
                })

                file.uniqueIdentifier = md5;
                file.resume();
                this.remove(file);
            },
        },
        watch: {},
        components: {
            vueUpload,
            DxTextBox
        }
    }
</script>

<style lang="scss">
    $h-row: 50px;
    .file-panel {
        width: 97%;
        margin-top: 10px;
        margin-left: 25px;
        box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
        margin-right: 25px;
        > h2 {
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #ccc;
            background-color: #fff;
        }
        .file-list {
            position: relative;
            height: 360px;
            overflow-y: auto;
            background-color: rgb(250, 250, 250);
        }
        .file-item {
            position: relative;
            height: $h-row;
            line-height: $h-row;
            padding: 0 10px;
            border-bottom: 1px solid #ccc;
            background-color: #fff;
            z-index: 1;
            > li {
                display: inline-block;
            }
        }
        .file-type {
            width: 24px;
            height: 24px;
            vertical-align: -5px;
        }
        .file-name {
            width: 35%;
            margin-left: 10px;
        }
        .file-size {
            width: 18%;
        }
        .file-status {
            width: 18%;
        }
        .file-operate {
            width: 18%;
            > a {
                padding: 10px 5px;
                cursor: pointer;
                color: #666;
                &:hover {
                    color: #ff4081;
                }
            }
        }
        .file-type[icon=text] {
            background: url(../assets/images/text-icon.png);
        }
        .file-type[icon=video] {
            background: url(../assets/images/video-icon.png);
        }
        .file-type[icon=image] {
            background: url(../assets/images/image-icon.png);
        }
        .result-icon {
            width: 20px;
            height: 20px;
            margin: 0px 10px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            display: inline-block;
        }
        .delete-icon{
            background-image: url(../assets/images/delete-icon.png);
        }
        .start-icon{
            background-image: url(../assets/images/start-icon.png);
        }
        .stop-icon{
            background-image: url(../assets/images/stop-icon.png);
        }
        .progress {
            position: absolute;
            top: 0;
            left: 0;
            height: $h-row - 1;
            width: 0;
            background-color: #E2EDFE;
            z-index: -1;
        }
        .no-file {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
        }
    }
</style>