const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const quickTemp = require('..');

describe('quick-temp', function() {
  beforeEach(function() {
    this.obj = {};
  });

  afterEach(function() {
    quickTemp.remove(this.obj, 'tmpDir');
  });

  it('creates a temporary directory with makeOrRemake', function() {
    const dir = quickTemp.makeOrRemake(this.obj, 'tmpDir', 'MyClass');
    expect(dir).to.be.a('string');
    expect(fs.existsSync(dir)).to.be.true;
    expect(this.obj.tmpDir).to.equal(dir);
  });

  it('reuses the directory with makeOrReuse', function() {
    const first = quickTemp.makeOrReuse(this.obj, 'tmpDir', 'MyClass');
    const second = quickTemp.makeOrReuse(this.obj, 'tmpDir', 'MyClass');
    expect(first).to.equal(second);
  });

  it('remake clears the directory contents', function() {
    const dir = quickTemp.makeOrReuse(this.obj, 'tmpDir', 'MyClass');
    fs.writeFileSync(path.join(dir, 'file.txt'), 'content');
    expect(fs.existsSync(path.join(dir, 'file.txt'))).to.be.true;
    quickTemp.remake(this.obj, 'tmpDir');
    expect(fs.existsSync(path.join(dir, 'file.txt'))).to.be.false;
    expect(fs.existsSync(this.obj.tmpDir)).to.be.true;
  });

  it('names the directory after the class and property', function() {
    const dir = quickTemp.makeOrRemake(this.obj, 'tmpDir', 'BroccoliMergeTrees');
    expect(path.basename(dir)).to.match(/^broccoli_merge_trees-tmp_dir-\w{8}\.tmp$/);
  });

  it('cleans the class and property names', function() {
    const dir = quickTemp.makeOrRemake(this.obj, 'tmpDir', ' My-HTTP Funnel2 ');
    expect(path.basename(dir)).to.match(/^my_http_funnel-tmp_dir-\w{8}\.tmp$/);
  });

  it('splits words after a digit', function() {
    const dir = quickTemp.makeOrRemake(this.obj, 'tmpDir', 'Funnel2Plugin');
    expect(path.basename(dir)).to.match(/^funnel_plugin-tmp_dir-\w{8}\.tmp$/);
  });

  it('omits the class name for plain objects', function() {
    const dir = quickTemp.makeOrRemake(this.obj, 'tmpDir');
    expect(path.basename(dir)).to.match(/^tmp_dir-\w{8}\.tmp$/);
  });

  it('remove deletes the directory and nulls property', function() {
    const dir = quickTemp.makeOrRemake(this.obj, 'tmpDir', 'MyClass');
    quickTemp.remove(this.obj, 'tmpDir');
    expect(fs.existsSync(dir)).to.be.false;
    expect(this.obj.tmpDir).to.equal(null);
  });
});
