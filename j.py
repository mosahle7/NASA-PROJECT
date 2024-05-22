def fun(st):
    def backtrack(start,path):
        if start<=len(st) and path:
            substrings.append(''.join(path))
        for i in range(start,len(st)):
            path.append(st[i])
            backtrack(i+1,path)
            path.pop()
        

    substrings=[]
    backtrack(0,[])
    return substrings

st="abcd"
print(fun(st))