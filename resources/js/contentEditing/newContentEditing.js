/*内容编辑*/

$(function() {
	$(".contentEditing-page").addClass("active"); //给头部导航增加选中状态
	var contentEditing = new Vue({
		el: '#newContentEditing',
		data: {
			userId: $('#userId').val() - 0, //用户id
			userPermissions: $('#userPermissions').val() - 0, //用户状态
			//模板案例参数
			templateCase: {
				id: -1, //当前选中id
				index: 0, //当前选中的索引
				using: -1, //当前正在应用模板案例的索引
				list: [], //数据列表
				reviseIndex: 0, //修改时过度的index值
				realmName: '', //域名
				terminalNumber1: '', //终端号1
				terminalNumber2: '' //终端号2
			},
			//标签参数
			tabs: {
				id: -1, //当前选中id
				index: 0, //当前选中的索引
				list: [], //数据列表
                reviseIndex: 0, //修改时过度的index值
			},
			//对应模板标签显示的数据
			tabContent: {
				pageNum: 1, //存储分页
				list: [], //内容列表
				deleteDate: [], //要删除的数据
				scrollBol: true, //为了解决多次加载问题,
				scrollNo: true, //是否禁止加载
				themeNumber:1,//默认皮肤1
				realmName:'',//域名
				terminalNumber1:'',//终端号1
				terminalNumber2:''//终端号2
			},
			//对应模板标签新增弹层的数据
			layerContent: {
				pageNum: 1, //存储分页
				isAll: 0, //是否全选
				searchWord: '', //搜索字符
				list: [], //内容列表
				selectData: [], //选中的数据
				opConfig: {
					which: 0, //0为个人资源1为云端资源
					state: 0
				},
				timeSort: 1, //升序排序
				timer: null, //存定时器
				scrollBol: true, //为了解决多次加载问题,
				scrollNo: true //是否禁止加载
			}
		},
		watch: {
			'layerContent.searchWord': function(value) {
				this.layerContent.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g, ''); /*去前空格和敏感字符*/
			},
			'tabContent.terminalNumber1':function(value){
				 this.tabContent.terminalNumber1 = value.replace(/^[0\D]|\D/,''); //去掉空格
			},
			'tabContent.terminalNumber2':function(value){
				 this.tabContent.terminalNumber2 = value.replace(/^[0\D]|\D/,'');//去掉空格
			}
			
		},
		mounted: function() {
			this.getTemplateList(); //获取模板列表
			this.getRealmTerminal(); //获取每个模板对应的域名以及终端号
		},
		methods: {
			//获取模板列表
			getTemplateList: function() {
				var _this = this;

				$.ajax({
					type: 'POST',
					url: 'editContent/template/list.do',
					data: {
						pageNum: -1
					},
					success: function(data) {
						if(!isLogonError(data)) {
							return;
						}

						if(data.result) {
                            if(data.list.list.length){
                                for(var i=0,_len=data.list.list.length;i<_len;i++){
                                    data.list.list[i].edit = 0;
                                }
                            }

							if(data.list.list.length) { //模板列表不为空
                                _this.templateCase.list = data.list.list; //模板列表
                                _this.templateCase.index = 0; //模板列表索引
								_this.templateCase.id = _this.templateCase.list[0].id; //模板id
								_this.getTabList();
							} else {
								_this.templateCase.id = -1; //没有模板列表默认值
								_this.tabs.id = -1; //还原成默认的-1
                                _this.templateCase.list = []; //清空模板列表
                                _this.tabs.list = []; //清空标签数据
								_this.tabContent.list = []; //清空页面数据								
							}
						} else {
							layer.msg(data.msg);
						}
					},
					error: function(data) {
						layer.msg(data.msg);
					},
					dataType: 'JSON'
				});
			},
			//获取tab列表
			getTabList: function() {
				var _this = this;
				_this.tabContent.pageNum = 1; //还原内容页面的页面数

				if(_this.templateCase.id == -1) {
					_this.tabContent.list = []; //清空页面数据
					return;
				}

				$.ajax({
					type: 'POST',
					url: 'editContent/category/list.do',
					data: {
						pageNum: -1,
						templateId: _this.templateCase.id
					},
					success: function(data) {
						if(!isLogonError(data)) {
							return;
						}

                        if(data.result) {

							if(data.list.list.length){
                                for(var i=0,_len=data.list.list.length;i<_len;i++){
                                    data.list.list[i].edit = 0;
                                }
							}

							if(data.list.list.length) { //标签列表不为空
                                _this.tabs.list = data.list.list; //标签列表
                                _this.tabs.index = 0; //标签列表索引
								_this.tabs.id = _this.tabs.list[0].id; //标签id
								_this.getTabContent();
							} else {
								_this.tabs.list = []; //清空标签列表
								_this.tabs.id = -1; //标签id
								_this.tabContent.list = []; //清空页面数据	
							}
						} else {
							layer.msg(data.msg);
						}
					},
					error: function(data) {
						layer.msg(data.msg);
					},
					dataType: 'JSON'
				});
			},

			//获取页面中标签对应的资源
			getTabContent: function() {
				var _this = this;
				
				if(_this.tabs.id == -1) {
					return;
				}

				if(!_this.tabContent.scrollBol) {
					return;
				}
				
				$.ajax({
					type: 'POST',
					url: 'editContent/resource/list.do',
					data: {
						categoryId: _this.tabs.id,
						pageNum: -1 /*_this.tabContent.pageNum*/
					},
					beforesend:function(){ //如果要设置开关最好在beforesend里面设置，快速点击时不会出现问题
						_this.tabContent.scrollBol = false;
					},
					success: function(data) {
						if(!isLogonError(data)) {
							return;
						}
						if(data.result) {
							var _list = data.list.list;

							if(_this.tabContent.pageNum > 1) {
								if(_list.length) {
									_this.tabContent.list = _this.tabContent.list.concat(_list);
								}
							} else {
								_this.tabContent.list = _list;
								$(".botom-content-list").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
							}

							if(data.list.isLastPage) {
								_this.tabContent.scrollNo = false; //提示已经加载完成 
							} else {
								_this.tabContent.scrollNo = true; //如果没到还原成true，这里写其他地方不需要操作，请求即可
							}
						}else{ //这个地方没有数据时后端返回的是false,所以通过pageNum清空页面数据
							if(_this.tabContent.pageNum <= 1){
								_this.tabContent.list = []; 
							}
						}
						setTimeout(function() {
							_this.tabContent.scrollBol = true;
						}, 350)
					},
					error: function(data) {
						layer.msg(data.msg);
						setTimeout(function() {
							_this.tabContent.scrollBol = true;
						}, 350)
					},
					dataType: 'JSON'
				})
			},

			//删除页面中的资源
			deleteTabContent: function(index) {
				var _this = this;
				var _str = '<div class="zlayer-wrap" style="display:block;">' +
					'<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">温馨提示</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
					'<div class="add-delete">' +
					'<div class="add-delete-txt">您确定要删除资源吗？</div>' +
					'<div class="add-delete-op"><button class="sham-btn sham-btn-sure">确定</button> <button class="sham-btn sham-btn-default">取消</button> </div>' +
					'</div></div></div>';
				
				var _index = layer.open({
					type: 1,
					closeBtn: 0,
					shade: [0.7],
					title: false,
					area: [],
					resize: false,
					content: _str,
					success: function() {	
						var _sendData = {
								categoryId : _this.tabs.id,
								resourceId : _this.tabContent.list[index].taskid,
								types : _this.tabContent.list[index].type
						};
						
						if(_this.tabContent.list[index].resourceState==3){ //判断云端资源
							_sendData.isClouldVideo = 1; //如果云端资源添加字段
						}
						
						$('.zlayer-close,.add-delete-op .sham-btn-default').click(function() {
							layer.close(_index);
						});

						$('.add-delete-op .sham-btn-sure').click(function() {
							$.ajax({
								type: 'POST',
								url: 'editContent/resource/delete.do',
								data: _sendData,
								success: function(data) {
									if(!isLogonError(data)) {
										return;
									}
									if(data.result) {
										layer.msg(data.msg);
										layer.close(_index);
										_this.getTabContent(); //重新拉取标签对应的数据
									} else {
										layer.msg(data.msg);
									}
								},
								error: function(data) {
									layer.msg(data.msg);
								},
								dataType: 'JSON'
							})
						})
					}
				});

			},
			//模板案例列表 和 标签列表 click事件
			navClick: function(index, type) {
				var _this = this;
				//type 0 为模板点击 1为tab点击
				switch(type) {
					case 0:
						if(index == _this.templateCase.index) {
							return;
						}
						_this.templateCase.id = _this.templateCase.list[index].id;
						_this.templateCase.index = index;
						_this.getTabList();
						break;
					case 1:
						if(index == _this.tabs.index) {
							return;
						}
						_this.tabs.id = _this.tabs.list[index].id;
						_this.tabs.index = index;
						_this.getTabContent();
						break;
				}
			},
			//模板案例列表 和 标签列表 新增事件
			navAdd: function(type) {
				var _stlt = '',
					_url = '',
					_data = {},
					_this = this;
				switch(type) {
					case 0:
						_stlt = '模板';
						_url = 'editContent/template/add.do';
						_data.createUserId = _this.userId;
						break;
					case 1:
						_stlt = '标签';
						_url = 'editContent/category/add.do';
						_data.templateId = _this.templateCase.id;
						break;
				}

				var _str = '<div class="zlayer-wrap" style="display:block;">' +
					'<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">添加' + _stlt + '</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
					'<div class="add-delete">' +
					'<div class="add-delete-input"><input type="text" placeholder="请输入' + _stlt + '的名称" maxlength=40 /></div>' +
					'<div class="add-delete-op"><button class="sham-btn sham-btn-sure">确定</button> <button class="sham-btn sham-btn-default">取消</button> </div>' +
					'</div></div></div>';

				var _index = layer.open({
					type: 1,
					closeBtn: 0,
					shade: [0.7],
					title: false,
					area: [],
					resize: false,
					content: _str,
					success: function() {
						$('.zlayer-close,.add-delete-op .sham-btn-default').click(function() {
							layer.close(_index);
						});

						$('.add-delete-op .sham-btn-sure').click(function() {
							_data.name = $('.add-delete-input input').val();
							var reg = /^[\u4e00-\u9fa5a-zA-Z\w]+$/;
							
							if(!_data.name){
								layer.msg('请输入'+_stlt+'名称');
								return;
							}	
							
							if(!reg.test(_data.name)) {
								layer.msg('名称，只能为中英文，数字，下划线组成');
								return;
							}
							
							$.ajax({
								type: 'POST',
								url: _url,
								data: _data,
								success: function(data) {
									if(!isLogonError(data)) {
										return;
									}
									if(data.result) {
										layer.msg(data.msg);
										if(type == 0) {
											_this.getTemplateList();
											layer.close(_index);
										} else {
											_this.getTabList();
											layer.close(_index);
										}
									} else {
										layer.msg(data.msg);
									}
								},
								error: function(data) {
									layer.msg(data.msg);
								},
								dataType: 'JSON'
							})
						})
					}
				});
			},
			//模板案例列表 和 标签列表 新增事件
			navDelete: function(type) {
				var _stlt = '',
					_url = '',
					_data = {},
					_this = this;
				switch(type) {
					case 0:
						_stlt = '模板';
						_url = 'editContent/template/delete.do';
						_data.templateIds = _this.templateCase.id;
						break;
					case 1:
						_stlt = '标签';
						_url = 'editContent/category/delete.do';
						_data.categoryIds = _this.tabs.id;
						_data.templateId = _this.templateCase.id;
						break;
				}

				var _str = '<div class="zlayer-wrap" style="display:block;">' +
					'<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">温馨提示</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
					'<div class="add-delete">' +
					'<div class="add-delete-txt">您确定要删除' + _stlt + '吗？</div>' +
					'<div class="add-delete-op"><button class="sham-btn sham-btn-sure">确定</button> <button class="sham-btn sham-btn-default">取消</button> </div>' +
					'</div></div></div>';

				var _index = layer.open({
					type: 1,
					closeBtn: 0,
					shade: [0.7],
					title: false,
					area: [],
					resize: false,
					content: _str,
					success: function() {
						$('.zlayer-close,.add-delete-op .sham-btn-default').click(function() {
							layer.close(_index);
						});

						$('.add-delete-op .sham-btn-sure').click(function() {
							$.ajax({
								type: 'POST',
								url: _url,
								data: _data,
								success: function(data) {
									if(!isLogonError(data)) {
										return;
									}
									if(data.result) {
										layer.msg(data.msg);
										if(type == 0) {
											_this.getTemplateList();
											layer.close(_index);
										} else {
											_this.getTabList();
											layer.close(_index);
										}
									} else {
										layer.msg(data.msg);
									}
								},
								error: function(data) {
									layer.msg(data.msg);
								},
								dataType: 'JSON'
							})
						})
					}
				});

			},
			//模板案例列表 和 标签列表 修改事件
			navRevise: function(type) {
				var _this = this,
					_url = '',
					_data = {};
				switch(type) {
					case 0:
						var _tm =  _this.templateCase;
                        _tm.list[_tm.index].edit = 1;
                        _tm.reviseIndex = _tm.index;
						//_this.templateCase.list = _this.templateCase.list.concat([]); //重新刷新数据让页面input显示
						setTimeout(function() { //为了触发focus
							$('.comm-nav-list input').eq(0).focus();
						}, 1);

						_url = 'editContent/template/list.do';
						_data.templateId = _this.templateCase.id;
						break;
					case 1:
                        var _tab =  _this.tabs;
                        _tab.list[_tab.index].edit = 1;
                        _tab.reviseIndex = _tab.index;
						//_this.tabs.list = _this.tabs.list.concat([]); //重新刷新数据让页面input显示
						setTimeout(function() { //为了触发focus
							$('.bottom-tabs-list input').eq(0).focus();
						}, 1);

						_url = 'editContent/category/list.do';
						_data.templateId = _this.templateCase.id;
						_data.id = _this.tabs.id;
						break;
				}

				$.ajax({
					type: 'POST',
					url: _url,
					data: _data,
					success: function(data) {
						if(!isLogonError(data)) {
							return;
						}
						if(data.result) {
							if(type == 0) {
								var _tm = _this.templateCase;
								_tm.list[_tm.reviseIndex].version = data.list.list[0].version; //更新最新version
							} else {
								var _tab = _this.tabs;
								_tab.list[_tab.reviseIndex].version = data.list.list[0].version; //更新最新version
							}
						} else {
							layer.msg(data.msg);
						}
					},
					error: function(data) {
						layer.msg(data.msg);
					},
					dataType: 'JSON'
				})
			},

			nav_blur: function(ev, type) {
				var _this = this,
					_newName = ev.currentTarget.value,
					_oldName = '',
					_url = '',
					_data = {};

				var reg = /^[\u4e00-\u9fa5a-zA-Z\w]+$/;

				switch(type) {
					case 0:
						var _tm = _this.templateCase;
                        _tm.list[_tm.reviseIndex].edit = 0;
						//_this.templateCase.list = _this.templateCase.list.concat([]); //重新刷新数据让页面input隐藏
						if(!reg.test(_newName)) {
							layer.msg('名称，只能为中英文，数字，下划线组成');
							return;
						}
						_oldName = _tm.list[_tm.reviseIndex].name; //现在输入的值

						if(_newName == _oldName) {
							return;
						}
						_url = 'editContent/template/edit.do';
						_data.templateId = _tm.id;
						_data.templateName = _newName;
						_data.version = _tm.list[_tm.reviseIndex].version;

						break;
					case 1:
						var _tab = _this.tabs;
                        _tab.list[_tab.reviseIndex].edit = 0;
						//_this.tabs.list = _this.tabs.list.concat([]); //重新刷新数据让页面input隐藏
						if(!reg.test(_newName)) {
							layer.msg('名称，只能为中英文，数字，下划线组成');
							return;
						}
						_oldName = _tab.list[_tab.reviseIndex].name; //现在输入的值
						if(_newName == _oldName) {
							return;
						}
						_url = 'editContent/category/edit.do';
						_data.templateId = _this.templateCase.id;
						_data.categoryId = _tab.id;
						_data.categoryName = _newName;
						_data.version = _tab.list[_tab.reviseIndex].version;
						break;
				}

				$.ajax({
					type: 'POST',
					url: _url,
					data: _data,
					success: function(data) {
						if(!isLogonError(data)) {
							return;
						}
						if(data.result) {
							layer.msg(data.msg);
							if(type == 0) {
								var _tm = _this.templateCase;
								_tm.list[_tm.reviseIndex].name = _newName;
							} else {
								var _tab = _this.tabs;
								_tab.list[_tab.reviseIndex].name = _newName;
							}
						
						} else {
							layer.msg(data.msg);
						}
					},
					error: function(data) {
						layer.msg(data.msg);
					},
					dataType: 'JSON'
				})
			},

			//添加资源弹层			
			resourceLayer: function() {
				var _this = this;
				var _index = layer.open({
					type: 1,
					closeBtn: 0,
					shade: [0.7],
					title: false,
					area: [],
					resize: false,
					scrollbar: false,
					shadeClose: false, //点击遮罩关闭
					content: $('#add_resources'),
					success: function() {
                        _this.layerContent.searchWord = ''; //清空搜索数据
                        _this.layerContent.list = []; //清空弹层数据
                        
						_this.getLayerResourceList();
						/**弹层成功时再初始化滚动条**/
						setNiceScroll({
							obj: $('.layer-bottom-body'),
							right: -15
						});
						 
						$('#add_resources .zlayer-close').click(function() {
							layer.close(_index);
						});
						
						$('#add_resources').off('click').on('click','._save',function(){
							_this.resourceAdd(_index);
						});
					},
					end: function() {
						//还原弹层的全选以及选中的数据等
						_this.layerContent.opConfig.which = 0; //还原到个人资源
						_this.layerContent.pageNum = 1; //数据从1页重新拉取
						_this.getTabContent(); //重新拉取标签对应的数据
						setTimeout(function(){//为了下次点开时有滚动条，先清除这次的
							$(".layer-bottom-body").getNiceScroll(0).remove();
						},300)
					}
				});
			},

			//弹层时间排序
			layerTimeSort: function() {
				var _this = this;
				_this.layerContent.pageNum = 1; //数据从1页重新拉取

				if(_this.layerContent.timer) {
					clearTimeout(_this.layerContent.timer);
				}

				if(_this.layerContent.timeSort) {
					_this.layerContent.timeSort = 0;
				} else {
					_this.layerContent.timeSort = 1;
				}

				_this.layerContent.timer = setTimeout(function() {
					_this.getLayerResourceList();
				}, 200)
			},

			//添加资源操作
			resourceAdd: function(_index) {
				var _this = this,
					_data = _this.layerContent.selectData,
					_taskId = '', //存要添加的ID
					_types = '', //存要添加资源对应的type
					_taskIndex = []; //存要添加的索引
				if(!_data.length) {
					layer.msg('请选择资源再添加');
					return;
				}

				for(var i = 0, _len = _data.length; i < _len; i++) { //数据转换
					if(i == _len - 1) {
						_taskId += _data[i].id;
						_types +=  _data[i].type;
					} else {
						_taskId += _data[i].id + ',';
						_types +=  _data[i].type + ',';
					}
					_taskIndex.push(_data[i].index);
				}
				
				var _ajaxData={},_ulr='';
				_ajaxData.categoryId = _this.tabs.id; 
				_ajaxData.templateId = _this.templateCase.id;
				_ajaxData.types = _types;
				if(_this.layerContent.opConfig.which){//云端资源添加资源
					_url = 'editContent/category/createCloudResources.do';
					_ajaxData.resourceIds = _taskId;
				}else{//个人资源添加资源
					_url = 'editContent/category/createCategoryResources.do';
					_ajaxData.taskIds = _taskId;
				}

				$.ajax({
					type: 'POST',
					url: _url,
					data: _ajaxData,
					success: function(data) {
						if(!isLogonError(data)) {
							return;
						}
						layer.msg(data.msg);
						if(data.result) {
							layer.close(_index);
							//_this.getLayerResourceList(); //重复拉取添加的资源列表
							
						}
					},
					error: function(data) {
						layer.msg(data.msg);
					},
					dataType: 'JSON'
				})
			},
			//个人资源云端资源切换
			tabChange: function(type) {
				var _this = this;
				_this.layerContent.timeSort = 1;
				_this.layerContent.searchWord = '';
				_this.layerContent.pageNum = 1;

				if(type == _this.layerContent.opConfig.which) {
					return;
				}

				if(type == 0) {
					_this.layerContent.opConfig.which = 0;
				} else if(type == 1) {
					_this.layerContent.opConfig.which = 1;
				}

				_this.getLayerResourceList();
			},

			//弹层搜索功能	
			layerSearch: function() {
				var _this = this;
				_this.layerContent.pageNum = 1; //还原页数
				_this.getLayerResourceList();
			},

			//获取弹层资源获取数据
			getLayerResourceList: function() {
				var _this = this,
					_url = '',
					_data = {};
				_data.pageNum = _this.layerContent.pageNum;
				_data.searchWord = _this.layerContent.searchWord;
				if(!_this.layerContent.scrollBol) {
					return;
				}

				switch(_this.layerContent.opConfig.which) {
					case 0:
						_data.startTimeSort = _this.layerContent.timeSort ? 'desc' : 'asc';
						_url = 'editContent/category/getPersonalResources.do';
						_data.categoryId = _this.tabs.id;
						break;
					case 1:
						_data.shareTimeSort = _this.layerContent.timeSort ? 'desc' : 'asc';
						_url = 'editContent/category/getCategoryResources.do';
						_data.categoryId = _this.tabs.id;
						break;
				}

				$.ajax({
					type: 'POST',
					url: _url,
					data: _data,
					beforeSend: function() {
						_this.layerContent.scrollBol = false;
					},
					success: function(data) {
						if(!isLogonError(data)) {
							return;
						}
						var _content = _this.layerContent; //弹层内容  
						if(data.result) {
							var _list = data.list.list;
							if(_list.length == 0) { //全选删除时取消选中
								_content.isAll = 0;
							} else {
								for(var i = 0, _len = _list.length; i < _len; i++) {
									_list[i].isSelected = 0;
								}
							}
							if(_content.pageNum > 1) {
								_content.list = _content.list.concat(_list);
							} else {
								_content.list = _list;
								_content.isAll = 0;
								_content.selectData.length = 0;
								$(".layer-bottom-body").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
							}

							if(data.list.isLastPage) {
								_content.scrollNo = false; //提示已经加载完成 
							} else {
								_content.scrollNo = true; //如果没到还原成true，这里写其他地方不需要操作，请求即可
							}
						} else {
							if(_content.pageNum <= 1 ){
								_content.list = [];
							}
							layer.msg(data.msg);
						}
						
						setTimeout(function() {
							_this.layerContent.scrollBol = true;
						}, 350)
					},
					error: function(data) {
						setTimeout(function() {
							_this.layerContent.scrollBol = true;
						}, 350)
						layer.msg(data.msg);
					},
					dataType: 'JSON'
				})
			},

			//选中要添加的资源
			selectClick: function(type, index) {
				var _this = this,
					_url = '',
					_data = {},
					_content = _this.layerContent, //弹层内容对象
					_sdata = _content.selectData,//弹层内容选中数据
					_which = _content.opConfig.which; //记录当前位置0为个人资源1为云端资源

				if(type == 1) { //单选
					var _num = _content.list[index].isSelected ? _content.list[index].isSelected = 0 : _content.list[index].isSelected = 1; //返回0和1,1代表选中0代表取消选中
					if(_num == 1) { //选中添加数据
						_sdata.push({
							"id": _which ? _content.list[index].sourceId:_content.list[index].taskid,
							"index": index,
							'type':_content.list[index].type
						});
					} else { //取消选中删除数据
						for(var i = 0, _len = _sdata.length; i < _len; i++) {
							//删除已经选中的数据
							if(_sdata[i].id == _content.list[index].taskid || _sdata[i].id == _content.list[index].sourceId) {
								_sdata.splice(i, 1);
								break;
							}
						}
					}

					if(_sdata.length != _content.list.length) {
						_content.isAll = 0;
					} else {
						_content.isAll = 1;
					}
				} else { //全选
					_sdata.length = 0;
					if(_content.isAll == 0) { //选中
						_content.isAll = 1;
						for(var i = 0, _len = _content.list.length; i < _len; i++) {
							_content.list[i].isSelected = 1;
							_sdata.push({
								"id": _which ? _content.list[i].sourceId:_content.list[i].taskid,
								"index": i,
								'type':_content.list[i].type
							});
						}
					} else { //取消选中
						_content.isAll = 0;
						for(var i = 0, _len = _content.list.length; i < _len; i++) {
							_content.list[i].isSelected = 0;
						}
					}
					
				}
			},
			//获取域名以及终端号1和2数据
			getRealmTerminal:function(){
				var _this = this;
				$.ajax({
					type:'POST',
					dataType:'JSON',
					url:'editContent/publishWeburl/list.do',
					data:{
						templateId:_this.templateCase.id
					},
					success:function(data){
						if(data.result){
							if(data.data){
								_this.tabContent.realmName = data.data.v2vdomain?data.data.v2vdomain:'';
								_this.tabContent.terminalNumber1 = data.data.v2vnumber1?data.data.v2vnumber1:'';
								_this.tabContent.terminalNumber2 = data.data.v2vnumber2?data.data.v2vnumber2:'';
							}else{
								_this.tabContent.realmName = '';
								_this.tabContent.terminalNumber1 = '';
								_this.tabContent.terminalNumber2 = '';
							}
						}
					},
					error:function(data){}
				})
			},
			//应用皮肤弹层
			applicationThemeLayer:function(){
				var _this = this;
				
				if( _this.templateCase.id == -1 ){
					return;
				}
				
				if(!_this.tabContent.realmName){
					layer.msg('域名不能为空');
					return;
				}
				
				if(!_this.tabContent.terminalNumber1 | !_this.tabContent.terminalNumber2){
					layer.msg('终端号不能为空');
					return;
				}else if(_this.tabContent.terminalNumber1 == _this.tabContent.terminalNumber2 ){
					layer.msg('终端号不能重复');
					return;
				}else if(_this.tabContent.terminalNumber1>65535 | _this.tabContent.terminalNumber2>65535){
					layer.msg('终端号最大值为65535');
					return;
				}
				
				var _index = layer.open({
					type: 1,
					closeBtn: 0,
					shade: [0.7],
					title: false,
					area: [],
					resize: false,
					scrollbar: false,
					shadeClose: false, //点击遮罩关闭
					content: $('#theme_layer'),
					success: function() {
						//每次页面弹层加载时都绑定一次事件，所以取消
						$('#theme_layer .sham-btn-default,#theme_layer .zlayer-close').click(function(){
							layer.close(_index);
						});
						
						$('#theme_layer .sham-btn-sure').one('click',function(){
							_this.applicationTheme(_index);
						})
					},
					end: function() {
						_this.tabContent.themeNumber = 1; //还原成默认第一个皮肤
					}
				});
				
			},
			
			//皮肤切换功能
			themeChange:function(num){
				var _this = this;
				
				if(num == _this.tabContent.themeNumber){
					return;
				}
				
				_this.tabContent.themeNumber = num;
			},
			
			//皮肤应用功能
			applicationTheme:function(layerIndex){
				var _this = this,_data={},
					_tabCon = this.tabContent;
				_data.templateThemeId = _tabCon.themeNumber;
				_data.templateId = _this.templateCase.id;
				_data.v2vdomain = _tabCon.realmName;
				_data.v2vnumber1 = _tabCon.terminalNumber1;
				_data.v2vnumber2 = _tabCon.terminalNumber2;

				$.ajax({
					type:'POST',
					url:'editContent/publishWeburl/add.do',
					data:_data,
					success:function(data){
						if(!isLogonError(data)) {
							return;
						}
						layer.msg(data.msg);
						layer.close(layerIndex);
						if(data.result){
							for(var i=0,_len=_this.templateCase.list.length;i<_len;i++){
								_this.templateCase.list[i].state = 0;
							}
							_this.templateCase.list[_this.templateCase.index].state = 1;
						}
					},
					error:function(data){
						layer.msg(data.msg);
					},
					dataType:'JSON'	
				})
			},
			
			//滚动加载事件
			fnScroll: function(event, type) {
				var _this = contentEditing,
					_target = $(event.target);
				//target为jq对象如$('.list-body'),type为了判断当前滚动的区域 0为内容的滚动 1为弹层的滚动

				/*if(!vm.scrollBol){
		    		return;
		    	}*/
				//滚动条距离顶部的高度
				var scrollTop = _target.getNiceScroll(0).cursor.css('top');
				//滚动条的高度
				var scrollHeight = _target.getNiceScroll(0).cursorheight;
				// tab的高度
				var _h = _target.height();

				switch(type) {
					case 0: //页面内容滚动
						if(parseInt(scrollTop) >= ((_h - scrollHeight))) {
							if(!_this.tabContent.scrollNo) {
								layer.msg('没有更多了！');
							} else if(_this.tabContent.scrollBol) {
								_this.tabContent.pageNum += 1;
								_this.getTabContent();
							}
						}
						break;
					case 1: //弹层内容滚动
						if(parseInt(scrollTop) >= ((_h - scrollHeight) * 0.95)) {
							if(!_this.layerContent.scrollNo) {
								layer.msg('没有更多了！');
							} else if(_this.layerContent.scrollBol) {
								_this.layerContent.pageNum += 1;
								_this.getLayerResourceList();
							}
						}
						break;
				}
			}
		}
	});

	/*自定义滚动条*/
	setNiceScroll([$('.comm-nav-list'), {
		obj: $('.bottom-tabs-list'),
		right: -10
	}, {
		obj: $('.botom-content-list'),
		right: -15
	}]);
});