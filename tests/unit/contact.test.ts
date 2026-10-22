import {test} from 'node:test';
import assert from 'node:assert/strict';
import {composeContactEmail,isContactEmail} from '../../src/lib/contact';
const fields={name:'Duy & team',email:'visitor@example.com',phone:'+84 123',subject:'PCB & IoT? #1',message:'Xin chào\nA&B + 50%?'};
test('email draft safely round-trips punctuation, Unicode and multiple lines',()=>{
  const link=composeContactEmail('hoangduy2206.ute@gmail.com',fields);
  const url=new URL(link);
  assert.equal(url.pathname,'hoangduy2206.ute@gmail.com');
  assert.equal(url.searchParams.get('subject'),fields.subject);
  assert.equal(url.searchParams.get('body'),`Name: Duy & team\nEmail: visitor@example.com\nPhone: +84 123\n\n${fields.message}`);
  assert.equal([...url.searchParams].length,2);
});
test('missing configuration and invalid required fields cannot compose a mailto',()=>{
  for(const value of ['', 'invalid', 'a@example.com?bcc=x@y.com','a@example.com\r\nbcc:x@y.com']){
    assert.equal(isContactEmail(value),false);
    assert.throws(()=>composeContactEmail(value,fields));
  }
  for(const patch of [{name:' '},{email:'invalid'},{message:' '}])assert.throws(()=>composeContactEmail('a@example.com',{...fields,...patch}));
});
test('subject cannot inject a header and optional fields have readable fallbacks',()=>{
  const url=new URL(composeContactEmail('a@example.com',{...fields,subject:'hello\r\nbcc:someone',phone:''}));
  assert.equal(url.searchParams.get('subject'),'hello bcc:someone');
  assert.match(url.searchParams.get('body')!,/Phone: Not provided/);
  assert.equal(new URL(composeContactEmail('a@example.com',{...fields,subject:''})).searchParams.get('subject'),'Hardware Lab project inquiry');
});
