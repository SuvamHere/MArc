'use strict';

function on(id,event,fn) {
    const el = document.getElementById(id);
    if(el) el.addEventListener(event,fn);
}

const QUESTIONS = [
    {
        context: "Sum all numbers from 1 to n",
        filename: "sum_range.py",
        language: "Python",
        lines: [
            {code: "def sum_to_n(n)", highlight: false },
            {code: "    total = 1", highlight:true},
            {code: "    for i in range(1,n+1):", highlight:false},
            {code: "    total += i", highlight:true},
            {code: "", highlight:false},
            {code: "print(sum_to_n(5))  #expected 15", highlight:true},
        ],
        bugLineIndex: 1,
        explanation: "total should start at 0, not 1. Starting at 1 adds and extra 1 to every result"
    },
    {
        context: "Return the largest number in a list",
        filename: "max.py",
        language: "Python",
        lines: [
            {code:"def find_max(nums):", highlight:false},
            {code:" max_val=0",higlight:true},
            {code:" for n in nums:", highlight:false},
            {code:"     if n> max_val:",higlight:true},
            {code:"         max_val = n", highlight:false},
            {code:" return max_val", highlight: true},
            {code:"",highlight:false},
            {code:"print(find_max([-3,-1,-7]))  #expected -1",highlight: true},
        ],
        bugLineIndex: 1,
        explanation: "Starting max_val at 0 breaks the function for all-negative lists. Should be nums[0]."
    },
    {
        context: "Check if a number is even",
        filename: "is_even.py",
        language:"Python3",
        lines:[
            {code:"def find_even(nums)"}
        ]
    }
]