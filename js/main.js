var rABS=true;var searchjuso=0;var markOverlay=[];var aColumn=[];var bColumn=[];var cColumn=[];var jusoNotFound=[];var coords=[];var geocoder=new daum.maps.services.Geocoder();var bounds=new daum.maps.LatLngBounds();var chkBackground=0;var fileClassBoolean=0;var mylocationCircle=0;var mylocationMark=0;var customMarkButtonBackground=0;var mapContainer=document.getElementById('map'),mapOption={center:new daum.maps.LatLng(37.290212,127.0094235),level:3};var map=new daum.maps.Map(mapContainer,mapOption);var mapTypeControl=new daum.maps.MapTypeControl();map.addControl(mapTypeControl,daum.maps.ControlPosition.TOPRIGHT);var zoomControl=new daum.maps.ZoomControl();map.addControl(zoomControl,daum.maps.ControlPosition.RIGHT);var marker=new daum.maps.Marker(),infowindow=new daum.maps.InfoWindow({zindex:1});daum.maps.event.addListener(map,'click',function(mouseEvent){searchDetailAddrFromCoords(mouseEvent.latLng,function(result,status){if(status===daum.maps.services.Status.OK){var detailAddr=!!result[0].road_address?'<div>도로명 : '+result[0].road_address.address_name+'</div>':'';detailAddr+='<div>지번 : '+result[0].address.address_name+'</div>';detailAddr+='위도 : '+mouseEvent.latLng.getLat()+'\u0020'+'경도 : '+mouseEvent.latLng.getLng();var content='<div class="bAddr">'+detailAddr+'</div>';marker.setPosition(mouseEvent.latLng);marker.setMap(map);infowindow.setContent(content);infowindow.open(map,marker)}else{detailAddr+='위도 : '+mouseEvent.latLng.getLat()+'\u0020'+'경도 : '+mouseEvent.latLng.getLng();var content='<div class="bAddr">'+detailAddr+'</div>';marker.setPosition(mouseEvent.latLng);marker.setMap(map);infowindow.setContent(content);infowindow.open(map,marker)}copy('위도 : '+mouseEvent.latLng.getLat()+'\u0020'+'경도 : '+mouseEvent.latLng.getLng())})});function searchAddrFromCoords(coords,callback){geocoder.coord2RegionCode(coords.getLng(),coords.getLat(),callback)}function searchDetailAddrFromCoords(coords,callback){geocoder.coord2Address(coords.getLng(),coords.getLat(),callback)}function searchAddress(){var temp=document.getElementById("inputAddress").value;var tempCoords=0;searchjuso=temp;geocoder.addressSearch(searchjuso,function(result,status){if(status===daum.maps.services.Status.OK){tempCoords=new daum.maps.LatLng(result[0].y,result[0].x);if(tempCoords!=null){marker.setPosition(tempCoords);marker.setMap(map);map.setCenter(tempCoords);map.setLevel(3)}}else{alert("주소 검색 실패")}})}function fixdata(data){var o="",l=0,w=10240;for(;l<data.byteLength/w;++l)o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w)));return o}function getConvertDataToBin($data){var arraybuffer=$data;var data=new Uint8Array(arraybuffer);var arr=new Array();for(var i=0;i!=data.length;++i)arr[i]=String.fromCharCode(data[i]);var bstr=arr.join("");return bstr}function handleFile(e){document.getElementById('endHidden').style.display='none';var files=e.target.files;var i,f;for(i=0;i!=files.length;++i){f=files[i];var reader=new FileReader();var name=f.name;reader.onload=function(e){var data=e.target.result;var workbook;if(rABS){workbook=XLSX.read(data,{type:'binary'})}else{var arr=fixdata(data);workbook=XLSX.read(btoa(arr),{type:'base64'})}workbook.SheetNames.forEach(function(item,index,array){var csv=XLSX.utils.sheet_to_csv(workbook.Sheets[item]);var json=XLSX.utils.sheet_to_json(workbook.Sheets[item]);var worksheet=workbook.Sheets[item];var range=XLSX.utils.decode_range(worksheet['!ref']);for(var j=1;range.e.r+2>=j;j++){aColumn[j]=(worksheet["A"+j]?worksheet["A"+j].v:undefined);bColumn[j]=(worksheet["B"+j]?worksheet["B"+j].v:undefined);cColumn[j]=(worksheet["C"+j]?worksheet["C"+j].v:undefined)}if(fileClassBoolean==0){var notFoundCount=0;aColumn.forEach(function(addr,index){geocoder.addressSearch(addr,function(result,status){if(status===daum.maps.services.Status.OK){coords[index]=new daum.maps.LatLng(result[0].y,result[0].x);if(coords[index]!==undefined){if(bColumn[index]==undefined){bColumn[index]="V"}var tempContent='<button type="button" class = "customMarkButton" id="tempId" onclick="closeOverlay(this.id)">'+bColumn[index]+'</button>';markOverlay[index]=new daum.maps.CustomOverlay({map:map,clickable:true,position:coords[index],content:tempContent});bounds.extend(coords[index]);map.setBounds(bounds);var tempElement=document.getElementById("tempId");switch(cColumn[index]){case'일반주택':case'상가주택':{tempElement.style.color="green";break}case'농사용':{tempElement.style.color="gold";break}case'휴게음식점':case'일반음식점':{tempElement.style.color="purple";break}case'노래연습장업':case'기타주점':case'유흥주점':case'단란주점':{tempElement.style.color="red";break}case'이동통신 중계기':{tempElement.style.color="blue";break}case'광업':case'하수폐기청소업':case'제조업':{tempElement.style.color="brown";break}default:tempElement.style.color="black"}document.getElementById("tempId").setAttribute('id',index)}}else{if(aColumn[index]){jusoNotFound[notFoundCount++]=aColumn[index]}var tempDiv=document.getElementById('chkNotFound');tempDiv.style.display='block'}})})}else{aColumn.forEach(function(addr,index){if(addr!==undefined){var tempCoords=new kakao.maps.LatLng(bColumn[index],cColumn[index]);var tempContent='<button type="button" class = "customMarkButton" id="tempId" onclick="closeOverlay(this.id)">'+aColumn[index]+'</button>';markOverlay[index]=new daum.maps.CustomOverlay({map:map,clickable:true,position:tempCoords,content:tempContent});bounds.extend(tempCoords);map.setBounds(bounds);document.getElementById("tempId").setAttribute('id',index)}});changecss('.customMarkButton','border-radius','50%');changecss('.customMarkButton','width','20px');changecss('.customMarkButton','height','20px');changecss('.customMarkButton','padding','0px 0px')}})};if(rABS)reader.readAsBinaryString(f);else reader.readAsArrayBuffer(f);var tempDiv=document.getElementById('noneBackgroundMenu');tempDiv.style.display='block'}}var input_dom_element;$(function(){input_dom_element=document.getElementById('my_file_input');if(input_dom_element.addEventListener){input_dom_element.addEventListener('change',handleFile,false)}});function fileClass(e){fileClassBoolean=e}function alertNotFound(){var alertNotFoundString=jusoNotFound.join("<br>");document.getElementById("alertTitle").innerHTML="검색 실패 항목";document.getElementById("alertContent").innerHTML=alertNotFoundString;goDetail()}function noneBackground(){if(customMarkButtonBackground==0){changecss('.customMarkButton','background','transparent');customMarkButtonBackground=1}else{changecss('.customMarkButton','background','white');customMarkButtonBackground=0}}function alertHelp(){var alertHelpString="-----Address Excel-----"+"<br>"+"A열 : 검색 주소 값"+"<br>"+"B열 : 표시 값"+"<br>"+"C열 : Category2"+"<br>"+"ex) : A열 : 영화동 338-1, B열 : 338-1, C열 : 일반주택"+"<br>"+"<br>"+"-----GPS Excel-----"+"<br>"+"A열 : No."+"<br>"+"B열 : 위도"+"<br>"+"C열 : 경도"+"<br>"+"ex) : A열 : 0, B열 : 37.290208, C열 : 127.011734"+"<br>"+"<br>"+"-----추가 기능-----"+"<br>"+"지도 클릭시 위도,경도 자동 복사"+"<br>"+"내 위치 및 오차 반경 표시"+"<br>"+"<br>"+"-----Category Color-----"+"<br>"+"Green : 일반주택, 상가주택"+"<br>"+"Gold : 농사용"+"<br>"+"Puple : 휴게음식점, 일반음식점"+"<br>"+"Red : 노래연습장업, 기타주점, 유흥주점, 단란주점"+"<br>"+"Blue : 이동통신 중계기"+"<br>"+"Brown : 광업, 하수폐기청소업, 제조업"+"<br>"+"Black : Default"+"<br>";document.getElementById("alertTitle").innerHTML="사용 설명서";document.getElementById("alertContent").innerHTML=alertHelpString;goDetail()}function copy(val){var dummy=document.createElement("textarea");document.body.appendChild(dummy);dummy.value=val;dummy.select();document.execCommand("copy");document.body.removeChild(dummy)}function closeOverlay(clicked_id){var tempId=clicked_id;var tempOverlay=markOverlay[tempId];tempOverlay.setVisible(false)}function wrapWindowByMask(){var maskHeight=$(document).height();var maskWidth=$(window).width();console.log("document 사이즈:"+$(document).width()+"*"+$(document).height());console.log("window 사이즈:"+$(window).width()+"*"+$(window).height());$('#mask').css({'width':maskWidth,'height':maskHeight});$('#mask').fadeTo("slow",0.5)}function popupOpen(){$('.layerpop').css("position","absolute");$('.layerpop').css("top",(($(window).height()-$('.layerpop').outerHeight())/2)+$(window).scrollTop());$('.layerpop').css("left",(($(window).width()-$('.layerpop').outerWidth())/2)+$(window).scrollLeft());$('#layerbox').show()}function popupClose(){$('#layerbox').hide();$('#mask').hide()}function goDetail(){popupOpen();wrapWindowByMask()}function success(pos){var crd=pos.coords;console.log('Your current position is:');console.log('Latitude : '+crd.latitude);console.log('Longitude: '+crd.longitude);console.log('More or less '+crd.accuracy+' meters.');if(mylocationCircle){mylocationCircle.setMap(null);mylocationCircle=null}if(mylocationMark){mylocationMark.setMap(null);mylocationMark=null}mylocationCircle=new kakao.maps.Circle({center:new kakao.maps.LatLng(crd.latitude,crd.longitude),radius:crd.accuracy,strokeWeight:3,strokeColor:'#75B8FA',strokeOpacity:1,strokeStyle:'dashed',fillColor:'#CFE7FF',fillOpacity:0.5});mylocationMark=new kakao.maps.Marker({position:new kakao.maps.LatLng(crd.latitude,crd.longitude)});mylocationMark.setMap(map);mylocationCircle.setMap(map);var moveLatLon=new kakao.maps.LatLng(crd.latitude,crd.longitude);map.panTo(moveLatLon)}function error(err){console.warn('ERROR('+err.code+'): '+err.message)}function mylocationMarker(){var options={enableHighAccuracy:true,timeout:5000,maximumAge:0};navigator.geolocation.getCurrentPosition(success,error,options)}

/***** Version History *****/
/*
Version 01 : Original
Version 02 : 검색 불가 항목 팝업 추가
            Category_Code2 엑셀 파싱 완료 및 색상별 마킹 추가 중
            소스 정리
Version 03 : Category_Code2 색상별 마킹 기능 및 색상 목록 추가
            소스 정리
Version 04 : 지도 클릭 시 위도, 경도 표시 추가
            인터페이스 정리 및 소스 정리
Version 05 : 지도 클릭 시 마커 및 인포박스 추가
            주소 검색 창 추가
            인터페이스 정리 및 소스 정리
Version 06 : 커스텀오버레이 숨김 기능 추가 (버튼 형식 변경)
            검색 실패 항목 팝업 변경
            인터페이스 정리 및 소스 정리
Version 07 : 인터페이스 변경 (메뉴화)
            GPS 주소 파일 검색 기능 추가
            소스 정리
Version 08 : 내위치 기능 추가
            소스 정리
Version 09 : 커스텀오버레이 배경 투명화 기능 추가
            소스 정리
Version 10 : GPS 커스텀마크 수정 (100단위 인터페이스 수정)
            소스 정리
// 당분간 안건드림... 귀찮음...
*/
// made by Jeong
