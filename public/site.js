(() => {
  'use strict';
  const menuButton=document.querySelector('.menu-toggle');
  const navigation=document.getElementById('main-navigation');
  const productButton=document.querySelector('.product-toggle');
  const productMenu=document.getElementById('product-menu');
  function closeProducts(){productButton.setAttribute('aria-expanded','false');productMenu.hidden=true;}
  function closeNavigation(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');navigation.classList.remove('is-open');closeProducts();}
  menuButton.addEventListener('click',()=>{
    const open=menuButton.getAttribute('aria-expanded')!=='true';
    menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('is-open',open);
    if(!open)closeProducts();
  });
  productButton.addEventListener('click',()=>{const open=productButton.getAttribute('aria-expanded')!=='true';productButton.setAttribute('aria-expanded',String(open));productMenu.hidden=!open;});
  document.addEventListener('click',event=>{if(!event.target.closest('.product-navigation'))closeProducts();if(!event.target.closest('.site-header')&&navigation.classList.contains('is-open'))closeNavigation();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(productButton.getAttribute('aria-expanded')==='true'){closeProducts();productButton.focus();}else if(navigation.classList.contains('is-open')){closeNavigation();menuButton.focus();}}});
  navigation.addEventListener('focusout',event=>{if(!navigation.contains(event.relatedTarget)){closeProducts();if(event.relatedTarget!==menuButton&&navigation.classList.contains('is-open'))closeNavigation();}});
  window.matchMedia('(min-width:1001px)').addEventListener('change',event=>{if(event.matches)closeNavigation();});

  const galleryDialog=document.getElementById('gallery-dialog');
  if(galleryDialog){
    const galleryButtons=Array.from(document.querySelectorAll('.gallery-button'));
    let galleryIndex=0;
    const updateGallery=()=>{const button=galleryButtons[galleryIndex];galleryDialog.querySelector('.large-image').src=button.dataset.image;galleryDialog.querySelector('.large-image').alt=button.dataset.caption;galleryDialog.querySelector('.gallery-caption').textContent=button.dataset.caption;galleryDialog.querySelector('.gallery-position').textContent=`${galleryIndex+1} / ${galleryButtons.length}`;};
    galleryButtons.forEach((button,index)=>button.addEventListener('click',()=>{galleryIndex=index;updateGallery();galleryDialog.showModal();}));
    galleryDialog.querySelector('[data-gallery=previous]')?.addEventListener('click',()=>{galleryIndex=(galleryIndex-1+galleryButtons.length)%galleryButtons.length;updateGallery();});
    galleryDialog.querySelector('[data-gallery=next]')?.addEventListener('click',()=>{galleryIndex=(galleryIndex+1)%galleryButtons.length;updateGallery();});
    galleryDialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight')galleryDialog.querySelector('[data-gallery=next]')?.click();if(event.key==='ArrowLeft')galleryDialog.querySelector('[data-gallery=previous]')?.click();});
  }
  document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));

  const formTabs=Array.from(document.querySelectorAll('.form-tab'));
  const showPanel=id=>{formTabs.forEach(tab=>{const selected=tab.getAttribute('aria-controls')===id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!selected;});};
  formTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>showPanel(tab.getAttribute('aria-controls')));
    tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?formTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+formTabs.length)%formTabs.length;showPanel(formTabs[next].getAttribute('aria-controls'));formTabs[next].focus();}});
  });
  if(formTabs.length){
    const params=new URLSearchParams(location.search);
    const productSelect=document.getElementById('rfq-product');
    if(params.has('product')&&Array.from(productSelect.options).some(o=>o.value===params.get('product')))productSelect.value=params.get('product');
    if(params.get('type')==='general'||location.hash==='#general-enquiry')showPanel('general-enquiry');
    window.addEventListener('hashchange',()=>{if(location.hash==='#general-enquiry')showPanel('general-enquiry');if(location.hash==='#rfq')showPanel('rfq');});
    showPanel(params.get('type')==='general'||location.hash==='#general-enquiry'?'general-enquiry':'rfq');
  }
  const reviewDialog=document.getElementById('enquiry-dialog');
  let enquiryText='';
  document.querySelectorAll('.enquiry-form').forEach(form=>{form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);const lines=[];
    const type=form.dataset.type==='rfq'?'Request for quotation':'General enquiry';
    for(const input of form.querySelectorAll('[name]')){
      if(input.type==='checkbox'||input.name==='recipient'||!String(data.get(input.name)||'').trim())continue;
      const label=form.querySelector(`label[for="${input.id}"]`);
      const labelText=label?label.childNodes[0].textContent.trim():input.name;
      const value=input.tagName==='SELECT'?input.options[input.selectedIndex].text:String(data.get(input.name)).trim();
      lines.push(`${labelText}: ${value}`);
    }
    enquiryText=`${type}\nSicher Engineering India Pvt. Ltd.\n\n${lines.join('\n\n')}\n\nDrawings and files, if required, will be attached separately in the email application.`;
    const company=String(data.get('company')||'').trim();
    const subject=`${type}${company?' — '+company:''}`;
    reviewDialog.querySelector('.enquiry-preview').textContent=enquiryText;
    reviewDialog.querySelector('.email-draft').href=`mailto:${String(data.get('recipient'))}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText)}`;
    reviewDialog.querySelector('.copy-status').textContent='';
    reviewDialog.showModal();
  });form.querySelector('fieldset').disabled=false;});
  if(reviewDialog){
    reviewDialog.querySelector('.copy-enquiry').addEventListener('click',async()=>{
      const status=reviewDialog.querySelector('.copy-status');
      try{await navigator.clipboard.writeText(enquiryText);status.textContent='Enquiry copied. Paste it into your email application.';}catch{status.textContent='Clipboard access is unavailable. Use Download enquiry or select the text above.';}
    });
    reviewDialog.querySelector('.download-enquiry').addEventListener('click',()=>{
      const url=URL.createObjectURL(new Blob([enquiryText],{type:'text/plain;charset=utf-8'}));
      const anchor=document.createElement('a');anchor.href=url;anchor.download='sicher-engineering-enquiry.txt';anchor.click();URL.revokeObjectURL(url);
      reviewDialog.querySelector('.copy-status').textContent='Enquiry downloaded. Attach drawings separately when you send your email.';
    });
  }
})();
